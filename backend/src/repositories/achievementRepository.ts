import prisma from "../config/prisma";

export const getAchievementByCode =
  async (
    code: string
  ) => {

    return prisma.achievement.findUnique({
      where: {
        code,
      },
    });
  };

export const getUserAchievement =
  async (
    userId: string,
    achievementId: string
  ) => {

    return prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    });
  };

export const unlockAchievement =
  async (
    userId: string,
    achievementId: string
  ) => {

    return prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
      },
    });
  };

export const getLatestUnseenAchievement =
  async (
    userId: string
  ) => {

    return prisma.userAchievement.findFirst({
      where: {
        userId,
        isViewed: false,
      },

      include: {
        achievement: true,
      },

      orderBy: {
        unlockedAt: "desc",
      },
    });
  };

export const markAchievementViewed =
  async (
    userAchievementId: string
  ) => {

    return prisma.userAchievement.update({
      where: {
        id: userAchievementId,
      },

      data: {
        isViewed: true,
      },
    });
  };

export const getAchievementById =
  async (
    achievementId: string
  ) => {

    return prisma.achievement.findUnique({
      where: {
        id: achievementId,
      },
    });
  };