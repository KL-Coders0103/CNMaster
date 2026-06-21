import {
  getConsistencyHeatmap,
  getRecentActivities,
  getWeeklyAnalyticsData,
} from "../repositories/analyticsRepository";

export const getWeeklyAnalytics =
  async (userId: string) => {

    const analytics =
      await getWeeklyAnalyticsData(
        userId
      );

    return {
      success: true,
      message:
        "Weekly analytics fetched successfully",
      data: analytics,
    };
  };

  export const fetchConsistencyHeatmap =
  async (
    userId: string
  ) => {

    const heatmap =
      await getConsistencyHeatmap(
        userId
      );

    return {
      success: true,
      data: heatmap,
    };
  };

export const fetchRecentActivities =
  async (
    userId: string
  ) => {

    const activities =
      await getRecentActivities(
        userId
      );

    return {
      success: true,
      data: activities,
    };
  };