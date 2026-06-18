import prisma from "../config/prisma";

type CreateXpTransactionParams = {
  userId: string;
  xpEarned: number;
  source: string;
  referenceId?: string;
};

export const createXpTransaction =
  async ({
    userId,
    xpEarned,
    source,
    referenceId,
  }: CreateXpTransactionParams) => {

    return prisma.xpTransaction.create({
      data: {
        userId,
        xpEarned,
        source,
        referenceId,
      },
    });
  };

export const getUserStats =
  async (
    userId: string
  ) => {

    return prisma.userStats.findUnique({
      where: {
        userId,
      },
    });
  };

export const updateUserStats =
  async (
    userId: string,
    xpCurrent: number,
    level: number,
    xpRequired: number
  ) => {

    return prisma.userStats.update({
      where: {
        userId,
      },

      data: {
        xpCurrent,
        level,
        xpRequired,
      },
    });
  };

export const updateDailyActivityXp =
  async (
    userId: string,
    xpEarned: number
  ) => {

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    return prisma.dailyActivity.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },

      update: {
        xpGained: {
          increment:
            xpEarned,
        },
      },

      create: {
        userId,
        date: today,
        xpGained:
          xpEarned,
      },
    });
  };

  export const hasXpTransaction =
  async (
    userId: string,
    source: string,
    referenceId: string
  ) => {

    return prisma.xpTransaction.findFirst({
      where: {
        userId,
        source,
        referenceId,
      },
    });
  };
