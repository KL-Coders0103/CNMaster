import { api } from "../api/axios";

export const markAchievementViewed =
  async (
    achievementId: string
  ) => {

    const response =
      await api.patch(
        `/achievements/${achievementId}/viewed`
      );

    return response.data;
  };