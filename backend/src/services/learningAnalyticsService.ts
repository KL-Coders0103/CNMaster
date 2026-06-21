import {
  getLearningAnalytics,
} from "../repositories/learningAnalyticsRepository";

export const fetchLearningAnalytics =
  async (
    userId: string
  ) => {

    const analytics =
      await getLearningAnalytics(
        userId
      );

    return {
      success: true,
      data: analytics,
    };
  };