import prisma from "../config/prisma";

export const getCompletedTaskDatesForStreak =
  async (
    userId: string
  ) => {

    return prisma.plannerTask.findMany({
      where: {
        userId,
        isCompleted: true,
        completedAt: {
          not: null,
        },
      },

      select: {
        completedAt: true,
      },

      orderBy: {
        completedAt: "desc",
      },
    });
  };

export const updateUserStreak =
  async (
    userId: string,
    streakDays: number
  ) => {

    return prisma.userStats.update({
      where: {
        userId,
      },

      data: {
        streakDays,
      },
    });
  };