import { api } from "../api/axios";


export const getWeeklyAnalytics =
  async () => {

    const response =
      await api.get(
        "/analytics/weekly"
      );

    return response.data;
  };

export const getHeatmap =
  async () => {

    const response =
      await api.get(
        "/analytics/heatmap"
      );

    return response.data;
  };

export const getRecentActivities =
  async () => {

    const response =
      await api.get(
        "/analytics/activities"
      );

    return response.data;
  };