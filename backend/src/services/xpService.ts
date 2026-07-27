import prisma from "../config/prisma";
import { calculateLevel } from "../utils/xpUtils";

import { 
  checkXpAchievements, 
  unlockLevel10Achievement, 
  unlockLevel20Achievement, 
  unlockLevel2Achievement, 
  unlockLevel30Achievement, 
  unlockLevel50Achievement, 
  unlockLevel5Achievement 
} from "./achievementService";
import { redisClient } from "../app";

export const awardXp = async (
  userId: string,
  xpEarned: number,
  source: string,
  referenceId?: string,
  skipAchievementChecks = false
) => {
  if (xpEarned <= 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await prisma.$transaction(async (tx) => {
    await tx.xpTransaction.create({
      data: { userId, xpEarned, source, referenceId },
    });

    const userStats = await tx.userStats.update({
      where: { userId },
      data: { xpCurrent: { increment: xpEarned } },
    });

    const previousLevel = userStats.level;
    const { level, currentLevelXp, totalXp, xpRequired } = calculateLevel(userStats.xpCurrent);

    if (level !== previousLevel) {
      await tx.userStats.update({
        where: { userId },
        data: { level, xpRequired },
      });
    }

    await tx.dailyActivity.upsert({
      where: { userId_date: { userId, date: today } },
      update: { xpGained: { increment: xpEarned } },
      create: { userId, date: today, xpGained: xpEarned },
    });

    return { totalXp, currentLevelXp, level, xpRequired, previousLevel };
  });

  await redisClient.del(`user:${userId}:heatmap`);

  checkXpAchievements(userId, result.totalXp).catch(console.error);

  if (!skipAchievementChecks && result.level > result.previousLevel) {
    const lvl = result.level;
    if (lvl >= 2 && result.previousLevel < 2) unlockLevel2Achievement(userId).catch(console.error);
    if (lvl >= 5 && result.previousLevel < 5) unlockLevel5Achievement(userId).catch(console.error);
    if (lvl >= 10 && result.previousLevel < 10) unlockLevel10Achievement(userId).catch(console.error);
    if (lvl >= 20 && result.previousLevel < 20) unlockLevel20Achievement(userId).catch(console.error);
    if (lvl >= 30 && result.previousLevel < 30) unlockLevel30Achievement(userId).catch(console.error);
    if (lvl >= 50 && result.previousLevel < 50) unlockLevel50Achievement(userId).catch(console.error);
  }

  return result;
};

export const hasXpTransaction = async (userId: string, source: string, referenceId: string) => {
  return prisma.xpTransaction.findFirst({
    where: { userId, source, referenceId },
  });
};