import prisma from "../config/prisma";
import { OtpPurpose } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  LoginInput, RegisterInput, VerifyEmailInput, RefreshTokenInput,
  LogoutInput, ResendOtpInput, CompleteProfileInput,
  VerifyForgotPasswordOtpInput, ForgotPasswordInput,
  ResetPasswordInput, GoogleLoginInput
} from "../validations/authValidation";
import { hashPassword } from "../utils/passwordUtils";
import { generateOtp, getOtpExpiry } from "../utils/otpUtils";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtUtils";
import { AppError } from "../utils/AppError";
import admin from "../config/firebaseAdmin";
import { 
  sendOtpEmail, 
  sendForgotPasswordOtp, 
  sendPasswordResetSuccessEmail 
} from "./email/emailService"; 

export const registerUser = async (registerData: RegisterInput) => {
  const { fullName, email, mobileNumber, password, year, branch, section } = registerData;

  const [existingUserByEmail, existingUserByMobile] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { mobileNumber } }),
  ]);

  if (existingUserByEmail?.isEmailVerified) throw new AppError("Email already exists", 409);
  if (existingUserByMobile?.isEmailVerified) throw new AppError("Mobile number already exists", 409);

  if (existingUserByEmail || existingUserByMobile) {
    const sameUnverifiedUser =
      existingUserByEmail && existingUserByMobile &&
      existingUserByEmail.id === existingUserByMobile.id &&
      !existingUserByEmail.isEmailVerified;

    if (!sameUnverifiedUser) throw new AppError("Email or mobile number already in use", 409);

    const existingOtp = await prisma.emailOtp.findUnique({
      where: { email_purpose: { email, purpose: OtpPurpose.registration } }
    });

    if (existingOtp) {
      const cooldownEndsAt = new Date(existingOtp.lastSentAt.getTime() + 30 * 1000);
      if (new Date() < cooldownEndsAt) throw new AppError("Please wait before requesting another OTP", 429);
      if (existingOtp.resendCount >= 5) throw new AppError("Too many OTP requests. Please try again after 15 minutes", 429);
    }
  } else {
    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: {
        fullName, email, mobileNumber, password: hashedPassword,
        ...(year && { year }), ...(branch && { branch }), ...(section && { section }),
        userStats: { create: {} },
      },
    });
  }

  const otp = generateOtp();
  await prisma.emailOtp.upsert({
    where: { email_purpose: { email, purpose: OtpPurpose.registration } },
    create: { email, purpose: OtpPurpose.registration, otp, expiresAt: getOtpExpiry(), resendCount: 0, lastSentAt: new Date(), isUsed: false },
    update: { otp, expiresAt: getOtpExpiry(), resendCount: { increment: 1 }, lastSentAt: new Date(), isUsed: false },
  });

  await sendOtpEmail(email, otp);

  return { success: true, message: "OTP sent successfully" };
};

export const verifyEmail = async (verifyData: VerifyEmailInput) => {
  const { email, otp } = verifyData;
  const emailOtp = await prisma.emailOtp.findFirst({
    where: { email, otp, purpose: OtpPurpose.registration },
  });

  if (!emailOtp) throw new AppError("Invalid OTP", 400);
  if (emailOtp.isUsed) throw new AppError("OTP has already been used", 400);
  if (emailOtp.expiresAt < new Date()) throw new AppError("OTP has expired", 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("User not found", 404);
  if (user.isEmailVerified) throw new AppError("Email already verified", 400);

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role, type: "refresh" });

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true } }),
    prisma.emailOtp.update({ where: { id: emailOtp.id }, data: { isUsed: true } }),
    prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        user: { connect: { id: user.id } },
      }
    })
  ]);

  return {
    success: true,
    message: "Email verified successfully",
    data: { accessToken, refreshToken, user },
  };
};

export const loginUser = async (loginData: LoginInput) => {
  const { identifier, password } = loginData;
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier.toLowerCase() }, { mobileNumber: identifier }],
    },
  });

  if (!user) throw new AppError("Invalid email/mobile or password", 401);
  if (!user.isEmailVerified) throw new AppError("Please verify your email first", 403);
  if (!user.password) throw new AppError("This account was created using Google. Please login with Google.", 400);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid email/mobile or password", 401);

  if (user.isSuspended) {
    throw new AppError("Your account has been suspended. Please contact the administrator.", 403);
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role, type: "refresh" });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      user: { connect: { id: user.id } },
    }
  });

  return {
    success: true,
    message: "Login successful",
    data: { accessToken, refreshToken, user },
  };
};

export const refreshAccessToken = async (refreshData: RefreshTokenInput) => {
  const { refreshToken } = refreshData;
  let decoded: any;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  if (decoded.type !== "refresh") throw new AppError("Invalid refresh token", 401);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) throw new AppError("Refresh token not found", 404);
  if (storedToken.isRevoked) throw new AppError("Refresh token revoked", 401);
  if (storedToken.expiresAt < new Date()) throw new AppError("Refresh token expired", 401);

  const accessToken = generateAccessToken({ userId: storedToken.user.id, role: storedToken.user.role });

  return {
    success: true,
    message: "Access token refreshed",
    data: { accessToken },
  };
};

export const logoutUser = async (logoutData: LogoutInput) => {
  const { refreshToken } = logoutData;

  try {
    verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!storedToken) throw new AppError("Refresh token not found", 404);
  if (storedToken.isRevoked) throw new AppError("Already logged out", 400);

  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { isRevoked: true },
  });

  return { success: true, message: "Logged out successfully" };
};

export const logoutAllUser = async (userId: string) => {
  await prisma.refreshToken.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true },
  });
  return { success: true, message: "Logged out from all devices successfully" };
};

export const resendOtp = async (resendData: ResendOtpInput) => {
  const { email } = resendData;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new AppError("User not found", 404);
  if (user.isEmailVerified) throw new AppError("Email already verified", 400);

  const existingOtp = await prisma.emailOtp.findUnique({
    where: { email_purpose: { email, purpose: OtpPurpose.registration } }
  });

  if (!existingOtp) throw new AppError("OTP not found. Please register again.", 404);

  const cooldownEndsAt = new Date(existingOtp.lastSentAt.getTime() + 30 * 1000);
  if (new Date() < cooldownEndsAt) throw new AppError("Please wait before requesting another OTP", 429);
  if (existingOtp.resendCount >= 5) throw new AppError("Too many OTP requests. Please try again after 15 minutes", 429);

  const otp = generateOtp();
  await prisma.emailOtp.update({
    where: { email_purpose: { email, purpose: OtpPurpose.registration } },
    data: { otp, expiresAt: getOtpExpiry(), resendCount: { increment: 1 }, lastSentAt: new Date(), isUsed: false },
  });

  await sendOtpEmail(email, otp);

  return { success: true, message: "OTP resent successfully" };
};

export const completeProfile = async (userId: string, profileData: CompleteProfileInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  let updateData: any = {
    year: profileData.year,
    branch: profileData.branch,
    section: profileData.section,
    isProfileCompleted: true,
  };

  if (user.provider === "google") {
    if (!profileData.mobileNumber || !profileData.password) {
      throw new AppError("Mobile number and password are required", 400);
    }

    const existingMobile = await prisma.user.findUnique({ where: { mobileNumber: profileData.mobileNumber } });
    if (existingMobile && existingMobile.id !== user.id) {
      throw new AppError("Mobile number already exists", 409);
    }

    updateData.mobileNumber = profileData.mobileNumber;
    updateData.password = await hashPassword(profileData.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return {
    success: true,
    message: "Profile completed successfully",
    data: { user: updatedUser },
  };
};

export const forgotPassword = async (forgotData: ForgotPasswordInput) => {
  const { email } = forgotData;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new AppError("User not found", 404);

  const existingOtp = await prisma.emailOtp.findUnique({
    where: { email_purpose: { email, purpose: OtpPurpose.forgotPassword } }
  });

  if (existingOtp) {
    const cooldownEndsAt = new Date(existingOtp.lastSentAt.getTime() + 30 * 1000);
    if (new Date() < cooldownEndsAt) throw new AppError("Please wait before requesting another OTP", 429);
    if (existingOtp.resendCount >= 5) throw new AppError("Too many OTP requests. Please try again after 15 minutes", 429);
  }

  const otp = generateOtp();
  await prisma.emailOtp.upsert({
    where: { email_purpose: { email, purpose: OtpPurpose.forgotPassword } },
    create: { email, purpose: OtpPurpose.forgotPassword, otp, expiresAt: getOtpExpiry(), resendCount: 0, lastSentAt: new Date(), isUsed: false },
    update: { otp, expiresAt: getOtpExpiry(), resendCount: { increment: 1 }, lastSentAt: new Date(), isUsed: false },
  });

  await sendForgotPasswordOtp(email, otp);

  return { success: true, message: "OTP sent successfully" };
};

export const verifyForgotPasswordOtp = async (verifyData: VerifyForgotPasswordOtpInput) => {
  const { email, otp } = verifyData;
  const emailOtp = await prisma.emailOtp.findFirst({
    where: { email, otp, purpose: OtpPurpose.forgotPassword },
  });

  if (!emailOtp) throw new AppError("Invalid OTP", 400);
  if (emailOtp.isUsed) throw new AppError("OTP has already been used", 400);
  if (emailOtp.expiresAt < new Date()) throw new AppError("OTP has expired", 400);

  return { success: true, message: "OTP verified successfully" };
};

export const resetPassword = async (resetData: ResetPasswordInput) => {
  const { email, otp, password } = resetData;
  const emailOtp = await prisma.emailOtp.findFirst({
    where: { email, otp, purpose: OtpPurpose.forgotPassword },
  });

  if (!emailOtp) throw new AppError("Invalid OTP", 400);
  if (emailOtp.isUsed) throw new AppError("OTP has already been used", 400);
  if (emailOtp.expiresAt < new Date()) throw new AppError("OTP has expired", 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("User not found", 404);

  const hashedPassword = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } }),
    prisma.emailOtp.update({ where: { id: emailOtp.id }, data: { isUsed: true } })
  ]);
  await sendPasswordResetSuccessEmail(email);

  return { success: true, message: "Password reset successfully" };
};

export const googleLogin = async (googleData: GoogleLoginInput) => {
  const { idToken } = googleData;
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const { uid, email, name } = decodedToken;

  if (!email) throw new AppError("Email not found", 400);

  let user = await prisma.user.findUnique({ where: { googleId: uid } });

  if (!user) {
    const existingEmailUser = await prisma.user.findUnique({ where: { email } });

    if (existingEmailUser) {
      if (existingEmailUser.provider === "email") {
        user = await prisma.user.update({
          where: { id: existingEmailUser.id },
          data: { googleId: uid, provider: "email_google" },
        });
      } else {
        user = existingEmailUser;
      }
    } else {
      user = await prisma.user.create({
        data: {
          fullName: name ?? "Google User",
          email,
          googleId: uid,
          provider: "google",
          isEmailVerified: true,
          userStats: { create: {} },
        },
      });
    }
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role, type: "refresh" });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      user: { connect: { id: user.id } },
    }
  });

  return {
    success: true,
    message: "Google login successful",
    data: { accessToken, refreshToken, user },
  };
};