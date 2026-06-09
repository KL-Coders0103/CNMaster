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

export const findOtpByEmailAndPurpose = async (
  email: string,
  purpose: OtpPurpose
) => {
  return prisma.emailOtp.findFirst({
    where: {
      email,
      purpose,
      isUsed: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createEmailOtp = async (
  data: Prisma.EmailOtpCreateInput
) => {
  return prisma.emailOtp.create({
    data,
  });
};

export const updateEmailOtp = async (
  otpId: string,
  data: Prisma.EmailOtpUpdateInput
) => {
  return prisma.emailOtp.update({
    where: {
      id: otpId,
    },
    data,
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