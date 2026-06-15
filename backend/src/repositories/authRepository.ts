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

export const findUserById =
  async (
    userId: string
  ) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
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
    data: {
      ...data,

      userStats: {
        create: {},
      },
    },
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

export const findUserByIdentifier = async (
  identifier: string
): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      OR: [
        {
          email: identifier.toLowerCase(),
        },
        {
          mobileNumber: identifier,
        },
      ],
    },
  });
};

export const createRefreshToken = async (
  data: Prisma.RefreshTokenCreateInput
) => {
  return prisma.refreshToken.create({
    data,
  });
};

export const findRefreshToken = async (
  token: string
) => {
  return prisma.refreshToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });
};

export const revokeRefreshToken = async (
  token: string
) => {
  return prisma.refreshToken.update({
    where: {
      token,
    },
    data: {
      isRevoked: true,
    },
  });
};

export const revokeAllRefreshTokens = async (
  userId: string
) => {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
      isRevoked: false,
    },
    data: {
      isRevoked: true,
    },
  });
};

export const updateUserProfile =
  async (
    userId: string,
    data: {
      year: string;
      branch: string;
      section: string;
    }
  ) => {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
        isProfileCompleted: true,
      },
    });
  };

export const updateUserPassword =
  async (
    userId: string,
    password: string
  ) => {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password,
      },
    });
  };

export const findUserByGoogleId =
  async (
    googleId: string
  ) => {
    return prisma.user.findUnique({
      where: {
        googleId,
      },
    });
  };

export const createGoogleUser =
  async (
    data: {
      fullName: string;
      email: string;
      googleId: string;
    }
  ) => {
    return prisma.user.create({
      data: {
        fullName: data.fullName,

        email: data.email,

        googleId: data.googleId,

        provider: "google",

        isEmailVerified: true,

        userStats: {
          create: {},
        },
      },
    });
  };

export const updateGoogleProfile =
  async (
    userId: string,
    data: {
      mobileNumber: string;
      password: string;
      year: string;
      branch: string;
      section: string;
    }
  ) => {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        mobileNumber:
          data.mobileNumber,

        password:
          data.password,

        year:
          data.year,

        branch:
          data.branch,

        section:
          data.section,

        isProfileCompleted:
          true,
      },
    });
  };

export const linkGoogleAccount =
  async (
    userId: string,
    googleId: string
  ) => {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        googleId,

        provider:
          "email_google",
      },
    });
  };