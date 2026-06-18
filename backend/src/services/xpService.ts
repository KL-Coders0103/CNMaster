import {
  calculateLevel,
} from "../utils/xpUtils";

import {
  createXpTransaction,
  getUserStats,
  updateUserStats,
  updateDailyActivityXp,
} from "../repositories/xpRepository";

import { AppError } from "../utils/AppError";
import { checkXpAchievements, unlockLevel10Achievement, unlockLevel20Achievement, unlockLevel2Achievement, unlockLevel30Achievement, unlockLevel50Achievement, unlockLevel5Achievement } from "./achievementService";

export const awardXp =
  async (
    userId: string,
    xpEarned: number,
    source: string,
    referenceId?: string,
    skipAchievementChecks = false
  ) => {

    const userStats =
      await getUserStats(
        userId
      );

    if (!userStats) {
      throw new AppError(
        "User stats not found",
        404
      );
    }

    await createXpTransaction({
      userId,
      xpEarned,
      source,
      referenceId,
    });

    const updatedXp =
      userStats.xpCurrent +
      xpEarned;

    const {
      level,
      currentLevelXp,
      totalXp,
      xpRequired,
    } =
      calculateLevel(
        updatedXp
      );

    const previousLevel = userStats.level;

    await updateUserStats(
      userId,
      updatedXp,
      level,
      xpRequired
    );

    await updateDailyActivityXp(
      userId,
      xpEarned
    );

    await checkXpAchievements(
      userId,
      updatedXp
    );

    if (!skipAchievementChecks) {
        if (previousLevel < 2 && level >= 2) {
        await unlockLevel2Achievement(userId);
      }

      if (previousLevel < 5 && level >= 5) {
        await unlockLevel5Achievement(userId);
      }

      if (previousLevel < 10 && level >= 10) {
        await unlockLevel10Achievement(userId);
      }

      if (previousLevel < 20 && level >= 20) {
        await unlockLevel20Achievement(userId);
      }

      if (previousLevel < 30 && level >= 30) {
        await unlockLevel30Achievement(userId);
      }

      if (previousLevel < 50 && level >= 50) {
        await unlockLevel50Achievement(userId);
      }
    }

    return {
      totalXp,
      currentLevelXp,
      level,
      xpRequired
    };
  };