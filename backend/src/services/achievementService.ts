import prisma from "../config/prisma";
import { ACHIEVEMENT_CODES } from "../constants/achievementConstants";
import { AppError } from "../utils/AppError";
import { evaluateMetaAchievements } from "./achievementEvaluator";

import { awardXp } from "./xpService"; 

type UnlockAchievementParams = {
  userId: string;
  achievementCode: string;
};

export const unlockAchievementIfEligible = async ({ userId, achievementCode }: UnlockAchievementParams) => {
  const achievement = await prisma.achievement.findUnique({
    where: { code: achievementCode },
    select: { id: true, xpReward: true }
  });

  if (!achievement) return null;

  try {
    const unlockedAchievement = await prisma.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
      },
    });
    
    if (achievement.xpReward > 0) {
      awardXp(
        userId,
        achievement.xpReward,
        "ACHIEVEMENT_UNLOCKED",
        achievement.id,
        true 
      ).catch(console.error);
    }

    if(achievementCode !== ACHIEVEMENT_CODES.LEGEND && achievementCode !== ACHIEVEMENT_CODES.UNSTOPPABLE) {
      evaluateMetaAchievements(userId).catch(console.error);
    }

    return unlockedAchievement;
  } catch (error : any) {
    if(error.code === 'P2002') return null;
    throw error;
  }
};


export const unlockFirstTaskAchievement = async (userId: string) => {
  return unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.FIRST_TASK });
};

export const unlockLevel2Achievement = async (userId: string) => {
  return unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.LEVEL_2 });
};

export const unlockLevel5Achievement = async (userId: string) => {
  return unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.LEVEL_5 });
};

export const unlockLevel10Achievement = async (userId: string) => {
  return unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.LEVEL_10 });
};

export const unlockLevel20Achievement = async (userId: string) => {
  return unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.LEVEL_20 });
};

export const unlockLevel30Achievement = async (userId: string) => {
  return unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.LEVEL_30 });
};

export const unlockLevel50Achievement = async (userId: string) => {
  return unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.LEVEL_50 });
};

export const unlockEarlybirdAchievement = async (userId: string) => {
  return unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.EARLY_BIRD });
};

export const unlockNightOwlAchievement = async (userId: string) => {
  return unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.NIGHT_OWL });
};

export const unlockConsistentPlannerAchievement = async (userId: string) => {
  return unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.CONSISTENT_PLANNER });
};


export const checkTaskAchievements = async (userId: string) => {
  const completedTasks = await prisma.plannerTask.count({
    where: { userId, isCompleted: true },
  });

  if (completedTasks >= 25) {
    await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.TASK_MASTER_25 });
  }
  if (completedTasks >= 50) {
    await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.TASK_MASTER_50 });
  }
  if (completedTasks >= 100) {
    await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.TASK_MASTER_100 });
  }
  if (completedTasks >= 250) {
    await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.TASK_MASTER_250 });
  }
};

export const checkXpAchievements = async (userId: string, totalXp: number) => {
  if (totalXp >= 100) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.XP_100 });
  if (totalXp >= 500) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.XP_500 });
  if (totalXp >= 1000) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.XP_1000 });
  if (totalXp >= 5000) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.XP_5000 });
  if (totalXp >= 10000) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.XP_10000 });
};

export const checkConsistentPlannerAchievement = async (userId: string) => {
  const activeDaysCount = await prisma.dailyActivity.count({
    where: { userId }
  });

  if(activeDaysCount >= 14){
    await unlockConsistentPlannerAchievement(userId);
  }
};

export const checkStreakAchievements = async (userId: string, streakDays: number) => {
  if (streakDays >= 3) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.STREAK_3 });
  if (streakDays >= 7) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.STREAK_7 });
  if (streakDays >= 15) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.STREAK_15 });
  if (streakDays >= 30) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.STREAK_30 });
  if (streakDays >= 60) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.STREAK_60 });
  if (streakDays >= 100) await unlockAchievementIfEligible({ userId, achievementCode: ACHIEVEMENT_CODES.STREAK_100 });
};


export const getLatestUnseenAchievement = async (userId: string) => {
  return prisma.userAchievement.findFirst({
    where: { userId, isViewed: false },
    include: { achievement: true },
    orderBy: { unlockedAt: "desc" },
  });
};

export const markAchievementAsViewed = async (userAchievementId: string, userId: string) => {
  const existingRecord = await prisma.userAchievement.findFirst({
    where: { id: userAchievementId, userId}
  });

  if(!existingRecord) {
    throw new AppError('Achievement not found or unauthorized', 404);
  }
  
  await prisma.userAchievement.update({
    where: { id: userAchievementId },
    data: { isViewed: true },
  });

  return { success: true, message: "Achievement marked as viewed" };
};