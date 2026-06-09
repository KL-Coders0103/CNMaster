import { OtpPurpose } from "@prisma/client";

import {
  findUserByEmail,
  findUserByMobile,
  createUser,
  findOtpByEmailAndPurpose,
  createEmailOtp,
  updateEmailOtp,
} from "../repositories/authRepository";

import { RegisterInput } from "../validations/authValidation";

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

  const existingUserByEmail = await findUserByEmail(email);

  const existingUserByMobile = await findUserByMobile(
    mobileNumber
  );

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

    const existingOtp =
      await findOtpByEmailAndPurpose(
        email,
        OtpPurpose.registration
      );

    const otp = generateOtp();

    if (existingOtp) {
      await updateEmailOtp(existingOtp.id, {
        otp,
        expiresAt: getOtpExpiry(),
        resendCount: {
          increment: 1,
        },
        lastSentAt: new Date(),
        isUsed: false,
      });
    } else {
      await createEmailOtp({
        email,
        otp,
        purpose: OtpPurpose.registration,
        expiresAt: getOtpExpiry(),
      });
    }

    console.log(
      `Registration OTP for ${email}: ${otp}`
    );

    return {
      success: true,
      message: "OTP resent successfully",
    };
  }

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

  await createEmailOtp({
    email,
    otp,
    purpose: OtpPurpose.registration,
    expiresAt: getOtpExpiry(),
  });

  console.log(
    `Registration OTP for ${email}: ${otp}`
  );

  return {
    success: true,
    message: "OTP sent successfully",
  };
};