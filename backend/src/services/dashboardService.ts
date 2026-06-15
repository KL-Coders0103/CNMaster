import { AppError } from "../utils/AppError";

import {
  getDashboardData,
} from "../repositories/dashboardRepository";

export const getHomeDashboard =
  async (userId: string) => {
    const user =
      await getDashboardData(
        userId
      );

    let achievement = null;

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    if (
      (user.userStats?.level ?? 1) >= 2
    ) {
      achievement = {
        title: "Rising Star",

        description:
          "You reached Level 2.",

        xp: 50,
      };
    }

    else if (
      user.learningProgress.length > 0 &&
      user.learningProgress[0].progress >= 100
    ) {
      achievement = {
        title: "First Milestone",

        description:
          "Completed your first learning module.",

        xp: 25,
      };
    }

    else if (
      user.plannerTasks.filter(
        task => task.isCompleted
      ).length >= 5
    ) {
      achievement = {
        title: "Task Master",

        description:
          "Completed 5 tasks.",

        xp: 20,
      };
    }

    return {
      success: true,

      message:
        "Dashboard fetched successfully",

      data: {
        user: {
          fullName:
            user.fullName,
        },

        streak: {
          days:
            user.userStats
              ?.streakDays ?? 0,
        },

        xp: {
          current:
            user.userStats
              ?.xpCurrent ?? 0,

          required:
            user.userStats
              ?.xpRequired ??
            500,

          level:
            user.userStats
              ?.level ?? 1,
        },

        continueLearning:
          user.learningProgress.length > 0
            ? {
                moduleName:
                  user.learningProgress[0]
                    .moduleName,

                progress:
                  user.learningProgress[0]
                    .progress,
              }
            : null,

        tasks: user.plannerTasks.map(
          task => ({
            id: task.id,

            title: task.title,

            completed:
              task.isCompleted,
          })
        ),

        weakAreas: [],

        notificationsCount:
          0,

        achievement,
      },
    };
  };