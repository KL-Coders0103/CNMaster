import prisma from "../config/prisma";
import { checkStreakAchievements } from "./achievementService";
import { formatLocalDate } from "../utils/dateUtils";

export const recalculateUserStreak = async (userId: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activities = await prisma.dailyActivity.findMany({
    where: { 
      userId, 
      date: { gte: thirtyDaysAgo },
      xpGained: { gt: 0 } 
    },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  const uniqueDays = [...new Set(activities.map((a) => formatLocalDate(a.date)))];

  if (uniqueDays.length === 0) {
    await updateStreak(userId, 0);
    return 0;
  }

  let streak = 0;
  const todayStr = formatLocalDate(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);

  if (uniqueDays[0] !== todayStr && uniqueDays[0] !== yesterdayStr) {
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
  checkStreakAchievements(userId, streak).catch(console.error); 

  return streak;
};

const updateStreak = async (userId: string, streakDays: number) => {
  return await prisma.userStats.update({
    where: { userId },
    data: { streakDays },
  });
};