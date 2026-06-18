import {
  ACHIEVEMENT_CODES,
} from "../constants/achievementConstants";

import {
  getAchievementByCode,
  getUserAchievement,
  markAchievementViewed,
  unlockAchievement,
} from "../repositories/achievementRepository";
import { getCompletedTaskDates, getCompletedTasksCount } from "../repositories/plannerRepository";
import { formatLocalDate } from "../utils/dateUtils";
import { awardXp } from "./xpService";

type UnlockAchievementParams = {
  userId: string;
  achievementCode: string;
};

export const unlockAchievementIfEligible = async({
  userId, achievementCode}: UnlockAchievementParams) => {
    const achievement = await getAchievementByCode(achievementCode);

    if(!achievement) return null;

    const existingAchievement = await getUserAchievement(userId, achievement.id);

    if(existingAchievement) return null;

    const unlockedAchievement = await unlockAchievement(userId, achievement.id);

    if(achievement.xpReward > 0) {
      await awardXp(
        userId,
        achievement.xpReward,
        "ACHIEVEMENT_UNLOCKED",
        achievement.id,
        true
      );
    }

    return unlockedAchievement;
  }

export const unlockFirstTaskAchievement =
  async (
    userId: string
  ) => {

    return unlockAchievementIfEligible({
      userId,
      achievementCode:
        ACHIEVEMENT_CODES.FIRST_TASK,
    });
  };

export const unlockLevel2Achievement =
  async (
    userId: string
  ) => {

    return unlockAchievementIfEligible({
      userId,
      achievementCode:
        ACHIEVEMENT_CODES.LEVEL_2,
    });
  };

export const unlockLevel5Achievement =
  async (
    userId: string
  ) => {

    return unlockAchievementIfEligible({
      userId,
      achievementCode:
        ACHIEVEMENT_CODES.LEVEL_5,
    });
  };

export const unlockLevel10Achievement =
  async (
    userId: string
  ) => {

    return unlockAchievementIfEligible({
      userId,
      achievementCode:
        ACHIEVEMENT_CODES.LEVEL_10,
    });
  };
export const unlockLevel20Achievement =
  async (
    userId: string
  ) => {

    return unlockAchievementIfEligible({
      userId,
      achievementCode:
        ACHIEVEMENT_CODES.LEVEL_20,
    });
  };
export const unlockLevel30Achievement =
  async (
    userId: string
  ) => {

    return unlockAchievementIfEligible({
      userId,
      achievementCode:
        ACHIEVEMENT_CODES.LEVEL_30,
    });
  };
export const unlockLevel50Achievement =
  async (
    userId: string
  ) => {

    return unlockAchievementIfEligible({
      userId,
      achievementCode:
        ACHIEVEMENT_CODES.LEVEL_50,
    });
  };

  export const markAchievementAsViewed =
  async (
    userAchievementId: string
  ) => {

    await markAchievementViewed(
      userAchievementId
    );

    return {
      success: true,
      message:
        "Achievement marked as viewed",
    };
  };

  export const checkTaskAchievements =
  async (
    userId: string
  ) => {

    const completedTasks =
      await getCompletedTasksCount(
        userId
      );

    if (
      completedTasks >= 25
    ) {

      await unlockAchievementIfEligible({
        userId,
        achievementCode:
          ACHIEVEMENT_CODES.TASK_MASTER_25,
      });

    }
    if (
      completedTasks >= 50
    ) {

      await unlockAchievementIfEligible({
        userId,
        achievementCode:
          ACHIEVEMENT_CODES.TASK_MASTER_50,
      });

    }
    if (
      completedTasks >= 100
    ) {

      await unlockAchievementIfEligible({
        userId,
        achievementCode:
          ACHIEVEMENT_CODES.TASK_MASTER_100,
      });

    }
    if (
      completedTasks >= 250
    ) {

      await unlockAchievementIfEligible({
        userId,
        achievementCode:
          ACHIEVEMENT_CODES.TASK_MASTER_250,
      });

    }
  };

export const checkXpAchievements = async(userId: string, totalXp: number) => {
  if(totalXp >= 100) {
    await unlockAchievementIfEligible({
      userId,
      achievementCode: ACHIEVEMENT_CODES.XP_100,
    });
  }

  if(totalXp >= 500) {
    await unlockAchievementIfEligible({
      userId,
      achievementCode: ACHIEVEMENT_CODES.XP_500,
    });
  }

  if(totalXp >= 1000) {
    await unlockAchievementIfEligible({
      userId,
      achievementCode: ACHIEVEMENT_CODES.XP_1000,
    });
  }

  if(totalXp >= 5000) {
    await unlockAchievementIfEligible({
      userId,
      achievementCode: ACHIEVEMENT_CODES.XP_5000,
    });
  }

  if(totalXp >= 10000) {
    await unlockAchievementIfEligible({
      userId,
      achievementCode: ACHIEVEMENT_CODES.XP_10000,
    });
  }
};

export const unlockEarlybirdAchievement = async(userId: string) => {
  return unlockAchievementIfEligible({
    userId,
    achievementCode: ACHIEVEMENT_CODES.EARLY_BIRD
  });
};

export const unlockNightOwlAchievement = async(userId: string) => {
  return unlockAchievementIfEligible({
    userId,
    achievementCode: ACHIEVEMENT_CODES.NIGHT_OWL
  });
};

export const unlockConsistentPlannerAchievement = async (userId: string) => {
  return unlockAchievementIfEligible({
    userId,
    achievementCode: ACHIEVEMENT_CODES.CONSISTENT_PLANNER,
  });
};

export const checkConsistentPlannerAchievement = async (userId: string) => {
  
  const completedTasks = await getCompletedTaskDates(userId);
  
  const uniqueDays = [
  ...new Set(
    completedTasks
      .filter(task => task.completedAt)
      .map(
        task =>
          formatLocalDate(
            task.completedAt!
          )
      )
  ),
];
  
  if (uniqueDays.length >= 14) {
    await unlockConsistentPlannerAchievement(userId);
  }
};

export const checkStreakAchievements =
  async (
    userId: string,
    streakDays: number
  ) => {

    if (streakDays >= 3) {
      await unlockAchievementIfEligible({
        userId,
        achievementCode:
          ACHIEVEMENT_CODES.STREAK_3,
      });
    }

    if (streakDays >= 7) {
      await unlockAchievementIfEligible({
        userId,
        achievementCode:
          ACHIEVEMENT_CODES.STREAK_7,
      });
    }

    if (streakDays >= 15) {
      await unlockAchievementIfEligible({
        userId,
        achievementCode:
          ACHIEVEMENT_CODES.STREAK_15,
      });
    }

    if (streakDays >= 30) {
      await unlockAchievementIfEligible({
        userId,
        achievementCode:
          ACHIEVEMENT_CODES.STREAK_30,
      });
    }

    if (streakDays >= 60) {
      await unlockAchievementIfEligible({
        userId,
        achievementCode:
          ACHIEVEMENT_CODES.STREAK_60,
      });
    }

    if (streakDays >= 100) {
      await unlockAchievementIfEligible({
        userId,
        achievementCode:
          ACHIEVEMENT_CODES.STREAK_100,
      });
    }
  };