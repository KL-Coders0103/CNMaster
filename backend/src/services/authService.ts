import { OtpPurpose } from "@prisma/client";

import {
  findUserByEmail,
  findUserByMobile,
  createUser,
  upsertEmailOtp,
  findActiveOtp,
  findOtpForVerification,
  markOtpAsUsed,
  verifyUserEmail,
} from "../repositories/authRepository";

import { RegisterInput, VerifyEmailInput } from "../validations/authValidation";

import { hashPassword } from "../utils/passwordUtils";
import { generateOtp, getOtpExpiry } from "../utils/otpUtils";

export const registerUser = async (
  registerData: RegisterInput
) => {
  const {
    fullName,
    email,
    mobileNumber,
    password,
    year,
    branch,
    section,
  } = registerData;

  /*
  |--------------------------------------------------------------------------
  | Existing User Checks
  |--------------------------------------------------------------------------
  */

  const existingUserByEmail = await findUserByEmail(email);

  const existingUserByMobile = await findUserByMobile(
    mobileNumber
  );

  /*
  |--------------------------------------------------------------------------
  | Verified Users
  |--------------------------------------------------------------------------
  */

  if (
    existingUserByEmail &&
    existingUserByEmail.isEmailVerified
  ) {
    throw new Error("Email already exists");
  }

  if (
    existingUserByMobile &&
    existingUserByMobile.isEmailVerified
  ) {
    throw new Error("Mobile number already exists");
  }

  /*
  |--------------------------------------------------------------------------
  | Unverified Users
  |--------------------------------------------------------------------------
  */

  if (
    existingUserByEmail ||
    existingUserByMobile
  ) {
    const sameUnverifiedUser =
      existingUserByEmail &&
      existingUserByMobile &&
      existingUserByEmail.id ===
        existingUserByMobile.id &&
      !existingUserByEmail.isEmailVerified;

    if (!sameUnverifiedUser) {
      throw new Error(
        "Email or mobile number already in use"
      );
    }

    const existingOtp = await findActiveOtp(
      email,
      OtpPurpose.registration
    );

    if (existingOtp) {
      const now = new Date();

      /*
      |--------------------------------------------------------------------------
      | Cooldown Check
      |--------------------------------------------------------------------------
      */

      const cooldownEndsAt = new Date(
        existingOtp.lastSentAt.getTime() +
          30 * 1000
      );

      if (now < cooldownEndsAt) {
        throw new Error(
          "Please wait before requesting another OTP"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Maximum Resend Attempts
      |--------------------------------------------------------------------------
      */

      if (existingOtp.resendCount >= 5) {
        throw new Error(
          "Too many OTP requests. Please try again after 15 minutes"
        );
      }
    }

    const otp = generateOtp();

    await upsertEmailOtp(
      email,
      OtpPurpose.registration,
      otp,
      getOtpExpiry()
    );

    console.log(
      `Registration OTP for ${email}: ${otp}`
    );

    return {
      success: true,
      message: "OTP resent successfully",
    };
  }

  /*
  |--------------------------------------------------------------------------
  | New User Registration
  |--------------------------------------------------------------------------
  */

  const hashedPassword =
    await hashPassword(password);

  await createUser({
    fullName,
    email,
    mobileNumber,
    password: hashedPassword,
    year,
    branch,
    section,
  });

  const otp = generateOtp();

  await upsertEmailOtp(
    email,
    OtpPurpose.registration,
    otp,
    getOtpExpiry()
  );

  console.log(
    `Registration OTP for ${email}: ${otp}`
  );

  return {
    success: true,
    message: "OTP sent successfully",
  };
};

export const verifyEmail = async (
  verifyData: VerifyEmailInput
) => {
  const { email, otp } = verifyData;

  /*
  |--------------------------------------------------------------------------
  | Find OTP
  |--------------------------------------------------------------------------
  */

  const emailOtp = await findOtpForVerification(
    email,
    otp,
    OtpPurpose.registration
  );

  if (!emailOtp) {
    throw new Error("Invalid OTP");
  }

  /*
  |--------------------------------------------------------------------------
  | Already Used
  |--------------------------------------------------------------------------
  */

  if (emailOtp.isUsed) {
    throw new Error("OTP has already been used");
  }

  /*
  |--------------------------------------------------------------------------
  | Expired OTP
  |--------------------------------------------------------------------------
  */

  if (emailOtp.expiresAt < new Date()) {
    throw new Error("OTP has expired");
  }

  /*
  |--------------------------------------------------------------------------
  | User Exists
  |--------------------------------------------------------------------------
  */

  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  /*
  |--------------------------------------------------------------------------
  | Already Verified
  |--------------------------------------------------------------------------
  */

  if (user.isEmailVerified) {
    throw new Error("Email already verified");
  }

  /*
  |--------------------------------------------------------------------------
  | Verify User
  |--------------------------------------------------------------------------
  */

  await verifyUserEmail(user.id);

  /*
  |--------------------------------------------------------------------------
  | Mark OTP Used
  |--------------------------------------------------------------------------
  */

  await markOtpAsUsed(emailOtp.id);

  return {
    success: true,
    message: "Email verified successfully",
  };
};