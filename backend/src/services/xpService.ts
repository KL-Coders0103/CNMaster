import prisma from "../config/prisma";
import { calculateLevel } from "../utils/xpUtils";
import { AppError } from "../utils/AppError";

// Ensure these imports point to your correctly unified achievement service
import { 
  checkXpAchievements, 
  unlockLevel10Achievement, 
  unlockLevel20Achievement, 
  unlockLevel2Achievement, 
  unlockLevel30Achievement, 
  unlockLevel50Achievement, 
  unlockLevel5Achievement 
} from "./achievementService";

export const awardXp = async (
  userId: string,
  xpEarned: number,
  source: string,
  referenceId?: string,
  skipAchievementChecks = false
) => {
  const userStats = await prisma.userStats.findUnique({
    where: { userId },
  });

  if (!userStats) throw new AppError("User stats not found", 404);

  await prisma.xpTransaction.create({
    data: { userId, xpEarned, source, referenceId },
  });

  const updatedXp = userStats.xpCurrent + xpEarned;
  const { level, currentLevelXp, totalXp, xpRequired } = calculateLevel(updatedXp);
  const previousLevel = userStats.level;

  await prisma.userStats.update({
    where: { userId },
    data: { xpCurrent: updatedXp, level, xpRequired },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyActivity.upsert({
    where: { userId_date: { userId, date: today } },
    update: { xpGained: { increment: xpEarned } },
    create: { userId, date: today, xpGained: xpEarned },
  });

  await checkXpAchievements(userId, updatedXp);

  if (!skipAchievementChecks) {
    if (previousLevel < 2 && level >= 2) await unlockLevel2Achievement(userId);
    if (previousLevel < 5 && level >= 5) await unlockLevel5Achievement(userId);
    if (previousLevel < 10 && level >= 10) await unlockLevel10Achievement(userId);
    if (previousLevel < 20 && level >= 20) await unlockLevel20Achievement(userId);
    if (previousLevel < 30 && level >= 30) await unlockLevel30Achievement(userId);
    if (previousLevel < 50 && level >= 50) await unlockLevel50Achievement(userId);
  }

  return { totalXp, currentLevelXp, level, xpRequired };
};

export const hasXpTransaction = async (userId: string, source: string, referenceId: string) => {
  return prisma.xpTransaction.findFirst({
    where: { userId, source, referenceId },
  });
};