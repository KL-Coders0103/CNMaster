import prisma from "../config/prisma";

export const getProfileByUserId = async (
  userId: string
) => {

  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    include: {
      userStats: true,

      userAchievements: {
        select: {
          id: true,
        },
      },
    },
  });
};

export const updateProfileByUserId =
  async (
    userId: string,
    data: {
      fullName: string;
      mobileNumber?: string;
      year: string;
      branch: string;
      section: string;
    }
  ) => {

    return prisma.user.update({
      where: {
        id: userId,
      },

      data,
    });
  };

export const getUserAchievements =
  async (
    userId: string
  ) => {

    return prisma.userAchievement.findMany({
      where: {
        userId,
      },

      include: {
        achievement: true,
      },

      orderBy: {
        unlockedAt: "desc",
      },
    });
  };

export const getAllAchievements =
  async () => {

    return prisma.achievement.findMany({
      orderBy: {
        xpReward: "asc",
      },
    });
  };

export const getProfileAnalytics =
  async (
    userId: string
  ) => {

    const [
      userStats,
      achievementCount,
      completedTasks,
      xpTransactions,
    ] = await Promise.all([

      prisma.userStats.findUnique({
        where: {
          userId,
        },
      }),

      prisma.userAchievement.count({
        where: {
          userId,
        },
      }),

      prisma.plannerTask.count({
        where: {
          userId,
          isCompleted: true,
        },
      }),

      prisma.xpTransaction.aggregate({
        where: {
          userId,
        },

        _sum: {
          xpEarned: true,
        },
      }),
    ]);

    return {
      userStats,
      achievementCount,
      completedTasks,
      totalXpEarned:
        xpTransactions._sum.xpEarned ?? 0,
    };
  };

export const getStreakAnalytics =
  async (
    userId: string
  ) => {

    const [
      userStats,
      activities,
    ] = await Promise.all([

      prisma.userStats.findUnique({
        where: {
          userId,
        },
      }),

      prisma.dailyActivity.findMany({
        where: {
          userId,
        },

        orderBy: {
          date: "asc",
        },
      }),
    ]);

    return {
      userStats,
      activities,
    };
  };

export const getLeaderboardData =
  async (
    userId: string
  ) => {

    const users =
      await prisma.user.findMany({
        where: {
          role: "student",
        },

        select: {
          id: true,
          fullName: true,

          userStats: {
            select: {
              level: true,
              xpCurrent: true,
            },
          },
        },
      });

    return {
      users,
      currentUserId: userId,
    };
  };

export const getActivityHistory =
  async (
    userId: string
  ) => {

    return prisma.dailyActivity.findMany({
      where: {
        userId,
      },

      orderBy: {
        date: "asc",
      },

      select: {
        date: true,
        xpGained: true,
      },
    });
  };

export const getAchievementSummary =
  async (
    userId: string
  ) => {

    const [
      totalAchievements,
      unlockedAchievements,
    ] = await Promise.all([

      prisma.achievement.count(),

      prisma.userAchievement.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      totalAchievements,
      unlockedAchievements,
    };
  };

export const getUserById =
  async (
    userId: string
  ) => {

    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  };

export const deleteUserAccount =
  async (
    userId: string
  ) => {

    return prisma.user.delete({
      where: {
        id: userId,
      },
    });
  };

export const getUserSettings =
  async (
    userId: string
  ) => {

    return prisma.userSettings.findUnique({
      where: {
        userId,
      },
    });
  };

export const createUserSettings =
  async (
    userId: string
  ) => {

    return prisma.userSettings.create({
      data: {
        userId,
      },
    });
  };

export const updateUserSettings =
  async (
    userId: string,
    data: {
      notificationsEnabled?: boolean;
      reminderEnabled?: boolean;
      darkMode?: boolean;
    }
  ) => {

    return prisma.userSettings.update({
      where: {
        userId,
      },

      data,
    });
  };

export const updateAvatar =
  async (
    userId: string,
    avatarUrl: string,
    avatarPublicId: string
  ) => {

    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        avatarUrl,
        avatarPublicId,
      },
    });
  };

export const getUserAvatar =
  async (
    userId: string
  ) => {

    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        avatarUrl: true,
        avatarPublicId: true,
      },
    });
  };

export const getUserPassword =
  async (
    userId: string
  ) => {

    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        password: true,
      },
    });
  };

export const updatePassword =
  async (
    userId: string,
    hashedPassword: string
  ) => {

    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password:
          hashedPassword,
      },
    });
  };

export const removeAvatar =
  async (
    userId: string
  ) => {

    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        avatarUrl: null,
        avatarPublicId:
          null,
      },
    });
  };

export const getProfileCompletionData =
  async (
    userId: string
  ) => {

    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        fullName: true,
        email: true,
        mobileNumber: true,
        avatarUrl: true,
        year: true,
        branch: true,
        section: true,
      },
    });
  };

