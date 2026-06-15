import prisma from "../config/prisma";

export const getDashboardData =
  async (userId: string) => {

    const today = new Date();

    const startOfDay =
      new Date(today);

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const endOfDay =
      new Date(today);

    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        fullName: true,

        userStats: {
          select: {
            streakDays: true,
            xpCurrent: true,
            xpRequired: true,
            level: true,
          },
        },

        learningProgress: {
          select: {
            moduleName: true,
            progress: true,
            lastAccessedAt: true,
          },

          orderBy: {
            lastAccessedAt: "desc",
          },

          take: 1,
        },

        plannerTasks: {
          where: {
            dueDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },

          orderBy: {
            dueDate: "asc",
          },

          select: {
            id: true,
            title: true,
            isCompleted: true,
          },
        },
      },
    });
  };