import { create } from "zustand";
import { getRecentActivities } from "../services/analyticsService";

interface Activity {
  id: string;
  action: string;
  createdAt: string;
}

interface ActivityStore {
  activities: Activity[];
  isLoading: boolean;
  fetchActivities: () => Promise<void>;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  isLoading: false,

  fetchActivities: async () => {
    try {
      set({ isLoading: true });
      
      const response = await getRecentActivities();

      set({
        activities: response.data, 
      });

    } catch (error) {
      console.log("Failed to fetch activities", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));