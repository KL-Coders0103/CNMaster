import { AppError } from "../utils/AppError";
import { getDashboardData } from "../repositories/dashboardRepository";
import { calculateLevel } from "../utils/xpUtils";
import { getLatestUnseenAchievement } from "../repositories/achievementRepository";
import { formatLocalDate } from "../utils/dateUtils";
import { MOTIVATIONS } from "../constants/motivationConstants";

export const getHomeDashboard = async (userId: string) => {
  const user = await getDashboardData(userId);
  const latestAchievement = await getLatestUnseenAchievement(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const tasks = user.plannerTasks ?? []; 
  const progressList = user.learningProgress ?? [];

  const rawActivities = user.dailyActivities ?? [];

  const activityHeatmap = rawActivities.map(activity => ({
    date: formatLocalDate(activity.date),
    xp:activity.xpGained,
  }));

  const xpCurrent = user.userStats?.xpCurrent ?? 0;

  const xpData = calculateLevel(xpCurrent);

  const achievement = latestAchievement ? {
    id:latestAchievement.id,
    title: latestAchievement.achievement.title,
    description: latestAchievement.achievement.description,
    xp: latestAchievement.achievement.xpReward
  } : null;

  const today = new Date().getDate();

  const motivation = MOTIVATIONS[today % MOTIVATIONS.length];

  const weakAreas =
  user.weakAreas ?? [];

return {
  success: true,
  message: "Dashboard fetched successfully",

  data: {
    user: {
      fullName: user.fullName,
    },

    streak: {
      days:
        user.userStats?.streakDays ?? 0,
    },

    xp: {
      totalXp: xpData.totalXp,
      current: xpData.currentLevelXp,
      required: xpData.xpRequired,
      level: xpData.level,
    },

    tasks: tasks.map(task => ({
      id: task.id,
      title: task.title,
      completed: task.isCompleted,
    })),

    continueLearning:
      progressList.length > 0
        ? {
            moduleName:
              progressList[0].moduleName,

            progress:
              progressList[0].progress,
          }
        : null,

    weakAreas,

    recommendedReview:
      weakAreas.length > 0
        ? {
            chapterId:
              weakAreas[0].chapterId,

            topic:
              weakAreas[0].title,

            message:
              `You are struggling with ${weakAreas[0].title}. Review this chapter to improve your quiz performance.`,
          }
        : null,

    notificationsCount:
      user.notificationsCount,

    upcomingAssessment:
      user.upcomingAssessment
        ? {
            id:
              user.upcomingAssessment.id,

            title:
              user.upcomingAssessment.title,

            type:
              user.upcomingAssessment.type,

            dueDate:
              user.upcomingAssessment.dueDate.toISOString(),
          }
        : null,

    activityHeatmap,

    achievement,

    motivation,
  },
}};