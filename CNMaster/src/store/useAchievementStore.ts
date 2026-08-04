import { create } from 'zustand';
import { api } from '../services/api';
import Toast from 'react-native-toast-message';

interface AchievementState {
  isMarkingViewed: boolean;
  markAsViewed: (userAchievementId: string) => Promise<boolean>;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  isMarkingViewed: false,

  markAsViewed: async (userAchievementId) => {
    set({ isMarkingViewed: true });
    try {
      const response = await api.patch(`/achievements/${userAchievementId}/viewed`);
      set({ isMarkingViewed: false });
      return response.data?.success === true;
    } catch (error) {
      console.error("Failed to mark achievement as viewed", error);
      set({ isMarkingViewed: false });
      return false;
    }
  },
}));