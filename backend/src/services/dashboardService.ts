import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { calculateLevel } from "../utils/xpUtils";
import { formatLocalDate } from "../utils/dateUtils";
import { MOTIVATIONS } from "../constants/motivationConstants";

import { getLatestUnseenAchievement } from "./achievementService"; 

export const getHomeDashboard = async (userId: string) => {
  const today = new Date();
  
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 89);
  ninetyDaysAgo.setHours(0, 0, 0, 0);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      year: true,
      branch: true,
      userStats: { 
        select: { streakDays: true, xpCurrent: true, xpRequired: true, level: true } 
      },
      learningProgress: { 
        select: { moduleName: true, progress: true }, 
        orderBy: { lastAccessedAt: 'desc' }, 
        take: 1 
      },
      plannerTasks: { 
        where: { 
          dueDate: { gte: startOfDay, lte: endOfDay },
          isCompleted: false, 
        },
        take: 5, 
        orderBy: { dueDate: 'asc' }, 
        select: { id: true, title: true, isCompleted: true } 
      }
    }
  });

  if (!user) throw new AppError("User not found", 404);

  const [notificationsCount, weakAreasRaw, upcomingAssessment, dailyActivities, latestAchievement] = await Promise.all([
    prisma.notification.count({ where: { userId, isRead: false } }),
    prisma.weakArea.findMany({
      where: { userId },
      include: { chapter: { select: { id: true, title: true } } },
      orderBy: { mistakeCount: "desc" },
      take: 5,
    }),
    prisma.assessment.findFirst({
      where: {
        dueDate: { gt: new Date() },
        OR: [
          { targetYear: user.year, targetBranch: user.branch },
          { targetYear: null, targetBranch: null }
        ]
      },
      orderBy: { dueDate: 'asc' }
    }),
    prisma.dailyActivity.findMany({
      where: { userId, date: { gte: ninetyDaysAgo } },
      orderBy: { date: 'asc' }
    }),
    getLatestUnseenAchievement(userId)
  ]);

  const activityHeatmap = dailyActivities.map(activity => ({
    date: formatLocalDate(activity.date),
    xp: activity.xpGained,
  }));

  const xpCurrent = user.userStats?.xpCurrent ?? 0;
  const xpData = calculateLevel(xpCurrent);

  const achievement = latestAchievement ? {
    id: latestAchievement.id,
    title: latestAchievement.achievement.title,
    description: latestAchievement.achievement.description,
    xp: latestAchievement.achievement.xpReward
  } : null;

  const currentDay = today.getDate();
  const motivation = MOTIVATIONS && MOTIVATIONS.length > 0 
    ? MOTIVATIONS[currentDay % MOTIVATIONS.length] 
    : "Keep pushing forward!";

  const weakAreas = weakAreasRaw.map(wa => ({
    id: wa.id,
    chapterId: wa.chapterId,
    title: wa.chapter.title,
    mistakeCount: wa.mistakeCount,
  }));

  return {
    success: true,
    message: "Dashboard fetched successfully",
    data: {
      user: {
        fullName: user.fullName,
      },
      streak: {
        days: user.userStats?.streakDays ?? 0,
      },
      xp: {
        totalXp: xpData.totalXp,
        current: xpData.currentLevelXp,
        required: xpData.xpRequired,
        level: xpData.level,
      },
      tasks: user.plannerTasks,
      continueLearning: user.learningProgress.length > 0 ? {
        moduleName: user.learningProgress[0].moduleName,
        progress: user.learningProgress[0].progress,
      } : null,
      weakAreas,
      recommendedReview: weakAreas.length > 0 ? {
        chapterId: weakAreas[0].chapterId,
        topic: weakAreas[0].title,
        message: `You are struggling with ${weakAreas[0].title}. Review this chapter to improve your quiz performance.`,
      } : null,
      notificationsCount,
      upcomingAssessment: upcomingAssessment ? {
        id: upcomingAssessment.id,
        title: upcomingAssessment.title,
        type: upcomingAssessment.type,
        dueDate: upcomingAssessment.dueDate.toISOString(),
      } : null,
      activityHeatmap,
      achievement,
      motivation,
    },
  };
};