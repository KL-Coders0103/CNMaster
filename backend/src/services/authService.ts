import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { redisClient } from "../app"; 
import {
  LoginInput, RegisterInput, VerifyEmailInput, RefreshTokenInput,
  LogoutInput, ResendOtpInput, CompleteProfileInput,
  VerifyForgotPasswordOtpInput, ForgotPasswordInput,
  ResetPasswordInput, GoogleLoginInput
} from "../validations/authValidation";
import { hashPassword } from "../utils/passwordUtils";
import { generateOtp, hashOtp, isOtpMatch, MAX_OTP_ATTEMPTS } from "../utils/otpUtils";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetPasswordToken,
  getTokenExpiry,
  hashRefreshToken,
  verifyRefreshToken,
  verifyResetPasswordToken,
} from "../utils/jwtUtils";
import { AppError } from "../utils/AppError";
import { toPublicUser } from "../utils/userResponse";
import admin from "../config/firebaseAdmin";
import { 
  sendOtpEmail, 
  sendForgotPasswordOtp, 
  sendPasswordResetSuccessEmail 
} from "./email/emailService"; 

export enum OtpPurpose {
  registration = "registration",
  forgotPassword = "forgotPassword"
}

const getValidOtp = async (email: string, otp: string, purpose: OtpPurpose) => {
  const redisKey = `otp:${purpose}:${email}`;
  const storedOtpData = await redisClient.get(redisKey);

  if (!storedOtpData) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  const emailOtp = JSON.parse(storedOtpData);

  if (emailOtp.attemptCount >= MAX_OTP_ATTEMPTS) {
    await redisClient.del(redisKey); 
    throw new AppError("Too many failed attempts. Please request a new OTP.", 400);
  }

  if (!isOtpMatch(otp, emailOtp.otpHash)) {
    emailOtp.attemptCount += 1;

    await redisClient.set(redisKey, JSON.stringify(emailOtp), "EX", 15 * 60); 
    throw new AppError("Invalid OTP", 400);
  }

  await redisClient.del(redisKey);
  return true;
};

const storeRefreshToken = (userId: string, refreshToken: string) =>
  prisma.refreshToken.create({
    data: {
      token: hashRefreshToken(refreshToken),
      expiresAt: getTokenExpiry(refreshToken),
      user: { connect: { id: userId } },
    },
  });

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
  const redisKey = `otp:${OtpPurpose.registration}:${email}`;
  
  const existingOtpData = await redisClient.get(redisKey);
  if (existingOtpData) {
    const parsedData = JSON.parse(existingOtpData);
    const timeSinceLastSent = Date.now() - parsedData.lastSentAt;
    
    if (timeSinceLastSent < 30 * 1000) throw new AppError("Please wait before requesting another OTP", 429);
    if (parsedData.resendCount >= 5) throw new AppError("Too many OTP requests. Please try again after 15 minutes", 429);
    
    parsedData.resendCount += 1;
    parsedData.otpHash = hashOtp(otp);
    parsedData.lastSentAt = Date.now();
    await redisClient.set(redisKey, JSON.stringify(parsedData), "EX", 15 * 60);
  } else {
    const newOtpData = {
      otpHash: hashOtp(otp),
      resendCount: 0,
      attemptCount: 0,
      lastSentAt: Date.now()
    };
    await redisClient.set(redisKey, JSON.stringify(newOtpData), "EX", 15 * 60);
  }

  await sendOtpEmail(email, otp);
  return { success: true, message: "OTP sent successfully" };
};

export const verifyEmail = async (verifyData: VerifyEmailInput) => {
  const { email, otp } = verifyData;

  await getValidOtp(email, otp, OtpPurpose.registration);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("User not found", 404);
  if (user.isEmailVerified) throw new AppError("Email already verified", 400);

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role, type: "refresh" });

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true } }),
    prisma.refreshToken.create({
      data: {
        token: hashRefreshToken(refreshToken),
        expiresAt: getTokenExpiry(refreshToken),
        user: { connect: { id: user.id } },
      },
    }),
  ]);

  return {
    success: true,
    message: "Email verified successfully",
    data: { accessToken, refreshToken, user: toPublicUser(user) },
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

  if (user.isSuspended || user.deletedAt) {
    throw new AppError("Your account is not active. Please contact the administrator.", 403);
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role, type: "refresh" });

  await storeRefreshToken(user.id, refreshToken);

  return {
    success: true,
    message: "Login successful",
    data: { accessToken, refreshToken, user: toPublicUser(user) },
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
    where: { token: hashRefreshToken(refreshToken) },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (storedToken.isRevoked) {
    await prisma.refreshToken.deleteMany({
      where: { userId: storedToken.userId },
    });
    throw new AppError("Session compromised. Please log in again.", 401);
  }

  if (
    storedToken.user.isSuspended ||
    storedToken.user.deletedAt ||
    !storedToken.user.isEmailVerified ||
    decoded.userId !== storedToken.userId ||
    decoded.role !== storedToken.user.role
  ) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new AppError("Invalid refresh token", 401);
  }

  const accessToken = generateAccessToken({ userId: storedToken.user.id, role: storedToken.user.role });
  const nextRefreshToken = generateRefreshToken({ userId: storedToken.user.id, role: storedToken.user.role, type: "refresh" });

  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    return tx.refreshToken.create({
      data: {
        token: hashRefreshToken(nextRefreshToken),
        expiresAt: getTokenExpiry(nextRefreshToken),
        userId: storedToken.userId,
      },
    });
  });

  return {
    success: true,
    message: "Access token refreshed",
    data: { accessToken, refreshToken: nextRefreshToken },
  };
};

export const logoutUser = async (logoutData: LogoutInput) => {
  const { refreshToken } = logoutData;

  try {
    verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const storedToken = await prisma.refreshToken.findUnique({ 
    where: { token: hashRefreshToken(refreshToken) } 
  });
  
  if (!storedToken) return { success: true, message: "Logged out successfully" };

  await prisma.refreshToken.delete({
    where: { id: storedToken.id },
  });

  return { success: true, message: "Logged out successfully" };
};

export const logoutAllUser = async (userId: string) => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
  return { success: true, message: "Logged out from all devices successfully" };
};

export const resendOtp = async (resendData: ResendOtpInput) => {
  const { email } = resendData;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new AppError("User not found", 404);
  if (user.isEmailVerified) throw new AppError("Email already verified", 400);

  const redisKey = `otp:${OtpPurpose.registration}:${email}`;
  const existingOtpData = await redisClient.get(redisKey);

  if (!existingOtpData) throw new AppError("OTP session expired. Please register again.", 404);

  const parsedData = JSON.parse(existingOtpData);
  const timeSinceLastSent = Date.now() - parsedData.lastSentAt;

  if (timeSinceLastSent < 30 * 1000) throw new AppError("Please wait before requesting another OTP", 429);
  if (parsedData.resendCount >= 5) throw new AppError("Too many OTP requests. Please try again after 15 minutes", 429);

  const otp = generateOtp();
  parsedData.resendCount += 1;
  parsedData.otpHash = hashOtp(otp);
  parsedData.lastSentAt = Date.now();
  
  await redisClient.set(redisKey, JSON.stringify(parsedData), "EX", 15 * 60);
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
    data: { user: toPublicUser(updatedUser) },
  };
};

export const forgotPassword = async (forgotData: ForgotPasswordInput) => {
  const { email } = forgotData;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return { success: true, message: "If the account exists, an OTP has been sent" };

  const redisKey = `otp:${OtpPurpose.forgotPassword}:${email}`;
  const existingOtpData = await redisClient.get(redisKey);

  if (existingOtpData) {
    const parsedData = JSON.parse(existingOtpData);
    const timeSinceLastSent = Date.now() - parsedData.lastSentAt;
    
    if (timeSinceLastSent < 30 * 1000) throw new AppError("Please wait before requesting another OTP", 429);
    if (parsedData.resendCount >= 5) throw new AppError("Too many OTP requests. Please try again after 15 minutes", 429);
    
    const otp = generateOtp();
    parsedData.resendCount += 1;
    parsedData.otpHash = hashOtp(otp);
    parsedData.lastSentAt = Date.now();
    await redisClient.set(redisKey, JSON.stringify(parsedData), "EX", 15 * 60);
    await sendForgotPasswordOtp(email, otp);
  } else {
    const otp = generateOtp();
    const newOtpData = {
      otpHash: hashOtp(otp),
      resendCount: 0,
      attemptCount: 0,
      lastSentAt: Date.now()
    };
    await redisClient.set(redisKey, JSON.stringify(newOtpData), "EX", 15 * 60);
    await sendForgotPasswordOtp(email, otp);
  }

  return { success: true, message: "If the account exists, an OTP has been sent" };
};

export const verifyForgotPasswordOtp = async (verifyData: VerifyForgotPasswordOtpInput) => {
  const { email, otp } = verifyData;
  await getValidOtp(email, otp, OtpPurpose.forgotPassword);

  const resetToken = generateResetPasswordToken({ email, type: "resetPassword" });

  return {
    success: true,
    message: "OTP verified successfully",
    data: { resetToken },
  };
};

export const resetPassword = async (resetData: ResetPasswordInput) => {
  const { email, resetToken, password } = resetData;

  let decoded: any;
  try {
    decoded = verifyResetPasswordToken(resetToken);
  } catch {
    throw new AppError("Invalid or expired reset token", 400);
  }

  if (decoded.type !== "resetPassword" || decoded.email !== email) {
    throw new AppError("Invalid reset token", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("User not found", 404);

  const hashedPassword = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } }),
    prisma.refreshToken.deleteMany({ where: { userId: user.id } }),
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

  if (user.isSuspended || user.deletedAt) {
    throw new AppError("Your account is not active. Please contact the administrator.", 403);
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role, type: "refresh" });

  await storeRefreshToken(user.id, refreshToken);

  return {
    success: true,
    message: "Google login successful",
    data: { accessToken, refreshToken, user: toPublicUser(user) },
  };
};