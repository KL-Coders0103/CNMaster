import prisma from "../config/prisma";
import { checkStreakAchievements } from "./achievementService";

export const recalculateUserStreak = async (userId: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const completedTasks = await prisma.plannerTask.findMany({
    where: {
      userId,
      isCompleted: true,
      completedAt: { gte: thirtyDaysAgo },
    },
    select: { completedAt: true },
    orderBy: { completedAt: "desc" },
  });

  const uniqueDays = [...new Set(completedTasks.map((t) => t.completedAt!.toISOString().split("T")[0]))];

  if (uniqueDays.length === 0) {
    await updateStreak(userId, 0);
    return 0;
  }

  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterdayStr) {
    await updateStreak(userId, 0);
    return 0;
  }

  streak = 1;
  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const current = new Date(uniqueDays[i]);
    const next = new Date(uniqueDays[i + 1]);

    const diff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  await updateStreak(userId, streak);
  await checkStreakAchievements(userId, streak);

  return streak;
};


const updateStreak = async (userId: string, streakDays: number) => {
  return await prisma.userStats.update({
    where: { userId },
    data: { streakDays },
  });
};