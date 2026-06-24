import { create } from "zustand";
import { getHeatmap } from "../services/analyticsService";
interface HeatmapDay {
  date: string;
  intensity: number;
}

interface HeatmapStore {
  heatmap: HeatmapDay[];
  fetchHeatmap: () => Promise<void>;
}

export const useHeatmapStore = create<HeatmapStore>((set) => ({
  heatmap: [],

  fetchHeatmap: async () => {
    try {
      const response = await getHeatmap();
      set({
        heatmap: response.data,
      });
    } catch (error) {
      console.log("Failed to fetch heatmap", error);
    }
  },
}));