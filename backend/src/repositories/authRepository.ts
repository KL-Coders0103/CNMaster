import prisma from "../config/prisma";
import { OtpPurpose, Prisma, User } from "@prisma/client";

export const findUserByEmail = async (
  email: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findUserByMobile = async (
  mobileNumber: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      mobileNumber,
    },
  });
};

export const createUser = async (
  data: Prisma.UserCreateInput
): Promise<User> => {
  return prisma.user.create({
    data,
  });
};

export const upsertEmailOtp = async (
  email: string,
  purpose: OtpPurpose,
  otp: string,
  expiresAt: Date
) => {
  return prisma.emailOtp.upsert({
    where: {
      email_purpose: {
        email,
        purpose,
      },
    },
    create: {
      email,
      purpose,
      otp,
      expiresAt,
      resendCount: 0,
      lastSentAt: new Date(),
      isUsed: false,
    },
    update: {
      otp,
      expiresAt,
      resendCount: {
        increment: 1,
      },
      lastSentAt: new Date(),
      isUsed: false,
    },
  });
};

export const findActiveOtp = async (
  email: string,
  purpose: OtpPurpose
) => {
  return prisma.emailOtp.findUnique({
    where: {
      email_purpose: {
        email,
        purpose,
      },
    },
  });
};

export const findOtpForVerification = async (
  email: string,
  otp: string,
  purpose: OtpPurpose
) => {
  return prisma.emailOtp.findFirst({
    where: {
      email,
      otp,
      purpose,
      isUsed: false,
    },
  });
};

export const markOtpAsUsed = async (
  otpId: string
) => {
  return prisma.emailOtp.update({
    where: {
      id: otpId,
    },
    data: {
      isUsed: true,
    },
  });
};

export const verifyUserEmail = async (
  userId: string
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isEmailVerified: true,
    },
  });
};