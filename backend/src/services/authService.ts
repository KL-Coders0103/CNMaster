import { OtpPurpose } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  findUserByEmail,
  findUserByMobile,
  createUser,
  upsertEmailOtp,
  findActiveOtp,
  findOtpForVerification,
  markOtpAsUsed,
  verifyUserEmail,
  createRefreshToken,
  findUserByIdentifier,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  updateUserProfile,
  updateUserPassword,
  createGoogleUser,
  findUserByGoogleId,
  updateGoogleProfile,
  findUserById,
  linkGoogleAccount
} from "../repositories/authRepository";

import { LoginInput, RegisterInput, VerifyEmailInput, RefreshTokenInput, LogoutInput, ResendOtpInput, CompleteProfileInput, VerifyForgotPasswordOtpInput, ForgotPasswordInput, ResetPasswordInput, GoogleLoginInput } from "../validations/authValidation";

import { hashPassword } from "../utils/passwordUtils";
import { generateOtp, getOtpExpiry } from "../utils/otpUtils";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtUtils";
import { sendOtpEmail } from "./email/emailService";
import { AppError } from "../utils/AppError";
import admin from "../config/firebaseAdmin";

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
    throw new AppError("Email already exists", 409);
  }

  if (
    existingUserByMobile &&
    existingUserByMobile.isEmailVerified
  ) {
    throw new AppError("Mobile number already exists", 409);
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
      throw new AppError(
        "Email or mobile number already in use",
        409
      );
    }

    const existingOtp = await findActiveOtp(
      email,
      OtpPurpose.registration
    );

    if (existingOtp) {
      const now = new Date();

      const cooldownEndsAt = new Date(
        existingOtp.lastSentAt.getTime() +
          30 * 1000
      );

      if (now < cooldownEndsAt) {
        throw new AppError(
          "Please wait before requesting another OTP", 429
        );
      }

      if (existingOtp.resendCount >= 5) {
        throw new AppError(
          "Too many OTP requests. Please try again after 15 minutes",
          429
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

    await sendOtpEmail(email, otp);

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
    ...(year && { year }),
    ...(branch && { branch }),
    ...(section && { section }),
  });

  const otp = generateOtp();

  await upsertEmailOtp(
    email,
    OtpPurpose.registration,
    otp,
    getOtpExpiry()
  );

  await sendOtpEmail(email, otp);

  return {
    success: true,
    message: "OTP sent successfully",
  };
};

export const verifyEmail = async (
  verifyData: VerifyEmailInput
) => {
  const { email, otp } = verifyData;

  const emailOtp = await findOtpForVerification(
    email,
    otp,
    OtpPurpose.registration
  );

  if (!emailOtp) {
    throw new AppError("Invalid OTP", 400);
  }

  if (emailOtp.isUsed) {
    throw new AppError("OTP has already been used", 400);
  }

  if (emailOtp.expiresAt < new Date()) {
    throw new AppError("OTP has expired", 400);
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isEmailVerified) {
    throw new AppError("Email already verified", 400);
  }

  await verifyUserEmail(user.id);

  await markOtpAsUsed(emailOtp.id);

  const accessToken =
    generateAccessToken({
      userId: user.id,
      role: user.role,
    });

  const refreshToken =
    generateRefreshToken({
      userId: user.id,
      role: user.role,
      type: "refresh",
    });

  await createRefreshToken({
    token: refreshToken,
    expiresAt: new Date(
      Date.now() +
        30 * 24 * 60 * 60 * 1000
    ),
    user: {
      connect: {
        id: user.id,
      },
    },
  });

  return {
    success: true,
    message: "Email verified successfully",
    data: {
      accessToken,
      refreshToken,
      user: {
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  mobileNumber: user.mobileNumber,

  role: user.role,

  provider: user.provider,
  googleId: user.googleId,

  year: user.year,
  branch: user.branch,
  section: user.section,

  isProfileCompleted:
    user.isProfileCompleted,
},
    },
  };
};

export const loginUser = async (
  loginData: LoginInput
) => {
  const { identifier, password } = loginData;

  const user = await findUserByIdentifier(
    identifier
  );

  if (!user) {
    throw new AppError("Invalid email/mobile or password", 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError(
      "Please verify your email first",
      403
    );
  }

  if (
    user.provider === "google"
  ) {
    throw new AppError(
      "This account was created using Google. Please login with Google.",
      400
    );
  }

  if (!user.password) {
    throw new AppError(
      "Password not set for this account.",
      400
    );
  }

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new AppError("Invalid email/mobile or password", 401);
  }

  const accessToken =
    generateAccessToken({
      userId: user.id,
      role: user.role,
    });

  const refreshToken =
    generateRefreshToken({
      userId: user.id,
      role: user.role,
      type: "refresh",
    });

  await createRefreshToken({
    token: refreshToken,
    expiresAt: new Date(
      Date.now() +
        30 * 24 * 60 * 60 * 1000
    ),
    user: {
      connect: {
        id: user.id,
      },
    },
  });

  return {
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      refreshToken,
      user: {
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  mobileNumber: user.mobileNumber,

  role: user.role,

  provider: user.provider,
  googleId: user.googleId,

  year: user.year,
  branch: user.branch,
  section: user.section,

  isProfileCompleted:
    user.isProfileCompleted,
},
    },
  };
};

export const refreshAccessToken = async (
  refreshData: RefreshTokenInput
) => {
  const { refreshToken } = refreshData;

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  if (decoded.type !== "refresh") {
    throw new AppError("Invalid refresh token", 401);
  }

  const storedToken =
    await findRefreshToken(refreshToken);

  if (!storedToken) {
    throw new AppError("Refresh token not found", 404);
  }

  if (storedToken.isRevoked) {
    throw new AppError("Refresh token revoked", 401);
  }

  if (storedToken.expiresAt < new Date()) {
    throw new AppError("Refresh token expired", 401);
  }

  const accessToken =
    generateAccessToken({
      userId: storedToken.user.id,
      role: storedToken.user.role,
    });

  return {
    success: true,
    message: "Access token refreshed",
    data: {
      accessToken,
    },
  };
};

export const logoutUser = async (
  logoutData: LogoutInput
) => {
  const { refreshToken } = logoutData;

  try {
    verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const storedToken = await findRefreshToken(
    refreshToken
  );

  if (!storedToken) {
    throw new AppError("Refresh token not found", 404);
  }

  if (storedToken.isRevoked) {
    throw new AppError("Already logged out", 400);
  }

  await revokeRefreshToken(refreshToken);

  return {
    success: true,
    message: "Logged out successfully",
  };
};

export const logoutAllUser = async (
  userId: string
) => {

  await revokeAllRefreshTokens(userId);

  return {
    success: true,
    message:
      "Logged out from all devices successfully",
  };
};

export const resendOtp = async (
  resendData: ResendOtpInput
) => {
  const { email } = resendData;

  const user =
    await findUserByEmail(email);

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  if (user.isEmailVerified) {
    throw new AppError(
      "Email already verified",
      400
    );
  }

  const existingOtp =
    await findActiveOtp(
      email,
      OtpPurpose.registration
    );

  if (!existingOtp) {
    throw new AppError(
      "OTP not found. Please register again.",
      404
    );
  }

  const now = new Date();

  const cooldownEndsAt =
    new Date(
      existingOtp.lastSentAt.getTime() +
        30 * 1000
    );

  if (now < cooldownEndsAt) {
    throw new AppError(
      "Please wait before requesting another OTP",
      429
    );
  }

  if (
    existingOtp.resendCount >= 5
  ) {
    throw new AppError(
      "Too many OTP requests. Please try again after 15 minutes",
      429
    );
  }

  const otp = generateOtp();

  await upsertEmailOtp(
    email,
    OtpPurpose.registration,
    otp,
    getOtpExpiry()
  );

  await sendOtpEmail(
    email,
    otp
  );

  return {
    success: true,
    message:
      "OTP resent successfully",
  };
};

export const completeProfile =
  async (
    userId: string,
    profileData: CompleteProfileInput
  ) => {
    const user =
      await findUserById(
        userId
      );

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    let updatedUser;

    if (
      user.provider ===
      "google"
    ) {
      if (
        !profileData.mobileNumber
      ) {
        throw new AppError(
          "Mobile number is required",
          400
        );
      }

      if (
        !profileData.password
      ) {
        throw new AppError(
          "Password is required",
          400
        );
      }

      const existingMobile =
        await findUserByMobile(
          profileData.mobileNumber
        );

      if (
        existingMobile &&
        existingMobile.id !==
          user.id
      ) {
        throw new AppError(
          "Mobile number already exists",
          409
        );
      }

      const hashedPassword =
        await hashPassword(
          profileData.password
        );

      updatedUser =
        await updateGoogleProfile(
          userId,
          {
            mobileNumber:
              profileData.mobileNumber,

            password:
              hashedPassword,

            year:
              profileData.year,

            branch:
              profileData.branch,

            section:
              profileData.section,
          }
        );
    } else {
      updatedUser =
        await updateUserProfile(
          userId,
          {
            year:
              profileData.year,

            branch:
              profileData.branch,

            section:
              profileData.section,
          }
        );
    }

    return {
      success: true,

      message:
        "Profile completed successfully",

      data: {
        user: {
          id:
            updatedUser.id,

          fullName:
            updatedUser.fullName,

          email:
            updatedUser.email,

          mobileNumber:
            updatedUser.mobileNumber,

          role:
            updatedUser.role,

          provider:
            updatedUser.provider,

          googleId:
            updatedUser.googleId,

          year:
            updatedUser.year,

          branch:
            updatedUser.branch,

          section:
            updatedUser.section,

          isProfileCompleted:
            updatedUser.isProfileCompleted,
        },
      },
    };
  };

export const forgotPassword =
  async (
    forgotData: ForgotPasswordInput
  ) => {
    const { email } =
      forgotData;

    const user =
      await findUserByEmail(
        email
      );

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    const existingOtp =
      await findActiveOtp(
        email,
        OtpPurpose.forgotPassword
      );

    if (existingOtp) {
      const cooldownEndsAt =
        new Date(
          existingOtp.lastSentAt.getTime() +
            30 * 1000
        );

      if (
        new Date() <
        cooldownEndsAt
      ) {
        throw new AppError(
          "Please wait before requesting another OTP",
          429
        );
      }

      if (
        existingOtp.resendCount >=
        5
      ) {
        throw new AppError(
          "Too many OTP requests. Please try again after 15 minutes",
          429
        );
      }
    }

    const otp =
      generateOtp();

    await upsertEmailOtp(
      email,
      OtpPurpose.forgotPassword,
      otp,
      getOtpExpiry()
    );

    await sendOtpEmail(
      email,
      otp
    );

    return {
      success: true,
      message:
        "OTP sent successfully",
    };
  };

export const verifyForgotPasswordOtp =
  async (
    verifyData: VerifyForgotPasswordOtpInput
  ) => {
    const {
      email,
      otp,
    } = verifyData;

    const emailOtp =
      await findOtpForVerification(
        email,
        otp,
        OtpPurpose.forgotPassword
      );

    if (!emailOtp) {
      throw new AppError(
        "Invalid OTP",
        400
      );
    }

    if (
      emailOtp.isUsed
    ) {
      throw new AppError(
        "OTP has already been used",
        400
      );
    }

    if (
      emailOtp.expiresAt <
      new Date()
    ) {
      throw new AppError(
        "OTP has expired",
        400
      );
    }

    return {
      success: true,
      message:
        "OTP verified successfully",
    };
  };

export const resetPassword =
  async (
    resetData: ResetPasswordInput
  ) => {
    const {
      email,
      otp,
      password,
    } = resetData;

    const emailOtp =
      await findOtpForVerification(
        email,
        otp,
        OtpPurpose.forgotPassword
      );

    if (!emailOtp) {
      throw new AppError(
        "Invalid OTP",
        400
      );
    }

    if (
      emailOtp.isUsed
    ) {
      throw new AppError(
        "OTP has already been used",
        400
      );
    }

    if (
      emailOtp.expiresAt <
      new Date()
    ) {
      throw new AppError(
        "OTP has expired",
        400
      );
    }

    const user =
      await findUserByEmail(
        email
      );

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    const hashedPassword =
      await hashPassword(
        password
      );

    await updateUserPassword(
      user.id,
      hashedPassword
    );

    await markOtpAsUsed(
      emailOtp.id
    );

    return {
      success: true,
      message:
        "Password reset successfully",
    };
  };

export const googleLogin = async (
  googleData: GoogleLoginInput
) => {
  const { idToken } = googleData;

  const decodedToken =
    await admin
      .auth()
      .verifyIdToken(idToken);

  const {
    uid,
    email,
    name,
  } = decodedToken;

  if (!email) {
    throw new AppError(
      "Email not found",
      400
    );
  }

  let user =
    await findUserByGoogleId(uid);

  /*
   Google already linked
  */
  if (!user) {
    const existingEmailUser =
      await findUserByEmail(email);

    /*
      Email account already exists
    */
    if (existingEmailUser) {

      /*
        Email only account
        → Link Google
      */
      if (
        existingEmailUser.provider ===
        "email"
      ) {
        user =
          await linkGoogleAccount(
            existingEmailUser.id,
            uid
          );
      }

      /*
        Already linked
      */
      else {
        user =
          existingEmailUser;
      }
    }

    /*
      Brand new Google user
    */
    else {
      user =
        await createGoogleUser({
          fullName:
            name ??
            "Google User",

          email,

          googleId:
            uid,
        });
    }
  }

  const accessToken =
    generateAccessToken({
      userId: user.id,
      role: user.role,
    });

  const refreshToken =
    generateRefreshToken({
      userId: user.id,
      role: user.role,
      type: "refresh",
    });

  await createRefreshToken({
    token: refreshToken,

    expiresAt: new Date(
      Date.now() +
        30 *
          24 *
          60 *
          60 *
          1000
    ),

    user: {
      connect: {
        id: user.id,
      },
    },
  });

  return {
    success: true,

    message:
      "Google login successful",

    data: {
      accessToken,

      refreshToken,

      user: {
        id: user.id,

        fullName:
          user.fullName,

        email:
          user.email,

        mobileNumber:
          user.mobileNumber,

        role:
          user.role,

        provider:
          user.provider,

        googleId:
          user.googleId,

        year:
          user.year,

        branch:
          user.branch,

        section:
          user.section,

        isProfileCompleted:
          user.isProfileCompleted,
      },
    },
  };
};
