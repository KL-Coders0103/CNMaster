import { api } from "../api/axios";


export const getLearningAnalytics =
  async () => {

    const response =
      await api.get(
        "/analytics/learning"
      );

    return response.data;
  };