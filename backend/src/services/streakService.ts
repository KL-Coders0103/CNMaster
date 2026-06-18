import {
  getCompletedTaskDatesForStreak,
  updateUserStreak,
} from "../repositories/streakRepository";

import {
  checkStreakAchievements,
} from "./achievementService";

export const recalculateUserStreak =
  async (
    userId: string
  ) => {

    const completedDates =
      await getCompletedTaskDatesForStreak(
        userId
      );

    const uniqueDays = [
      ...new Set(
        completedDates.map(
          task =>
            task.completedAt!
              .toISOString()
              .split("T")[0]
        )
      ),
    ];

    if (
      uniqueDays.length === 0
    ) {

      await updateUserStreak(
        userId,
        0
      );

      return 0;
    }

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const latestCompletedDay =
      new Date(
        uniqueDays[0]
      );

    latestCompletedDay.setHours(
      0,
      0,
      0,
      0
    );

    const daysSinceLastActivity =
      (
        today.getTime() -
        latestCompletedDay.getTime()
      ) /
      (
        1000 *
        60 *
        60 *
        24
      );

    if (
      daysSinceLastActivity > 1
    ) {

      await updateUserStreak(
        userId,
        0
      );

      return 0;
    }

    let streak = 1;

    for (
      let i = 0;
      i < uniqueDays.length - 1;
      i++
    ) {

      const current =
        new Date(
          uniqueDays[i]
        );

      const previous =
        new Date(
          uniqueDays[i + 1]
        );

      const diff =
        (
          current.getTime() -
          previous.getTime()
        ) /
        (
          1000 *
          60 *
          60 *
          24
        );

      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    await updateUserStreak(
      userId,
      streak
    );

    await checkStreakAchievements(
      userId,
      streak
    );

    return streak;
  };