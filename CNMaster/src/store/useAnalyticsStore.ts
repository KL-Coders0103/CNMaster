import { create } from 'zustand';
import { api } from '../services/api';
import { 
  WeeklyAnalytics, 
  LearningAnalytics, 
  HeatmapData, 
  RecentActivity, 
  WeakArea 
} from '../types';

interface AnalyticsState {
  weeklyAnalytics: WeeklyAnalytics | null;
  learningAnalytics: LearningAnalytics | null;
  heatmap: HeatmapData[];
  recentActivities: RecentActivity[];
  weakAreas: WeakArea[];
  
  isLoading: boolean;
  error: string | null;

  fetchDashboardData: () => Promise<void>;
  fetchWeeklyAnalytics: () => Promise<void>;
  fetchLearningAnalytics: () => Promise<void>;
  fetchHeatmap: () => Promise<void>;
  fetchRecentActivities: () => Promise<void>;
  fetchWeakAreas: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  weeklyAnalytics: null,
  learningAnalytics: null,
  heatmap: [],
  recentActivities: [],
  weakAreas: [],
  
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        get().fetchWeeklyAnalytics(),
        get().fetchLearningAnalytics(),
        get().fetchHeatmap(),
        get().fetchRecentActivities(),
        get().fetchWeakAreas()
      ]);
    } catch (error: any) {
      console.error("Failed to fetch analytics dashboard", error);
      set({ error: "Failed to load analytics data" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchWeeklyAnalytics: async () => {
    const res = await api.get('/analytics/weekly');
    if (res.data?.success) set({ weeklyAnalytics: res.data.data });
  },

  fetchLearningAnalytics: async () => {
    const res = await api.get('/analytics/learning');
    if (res.data?.success) set({ learningAnalytics: res.data.data });
  },

  fetchHeatmap: async () => {
    const res = await api.get('/analytics/heatmap');
    if (res.data?.success) set({ heatmap: res.data.data });
  },

  fetchRecentActivities: async () => {
    const res = await api.get('/analytics/activities');
    if (res.data?.success) set({ recentActivities: res.data.data });
  },

  fetchWeakAreas: async () => {
    const res = await api.get('/analytics/weak-areas');
    if (res.data?.success) set({ weakAreas: res.data.data });
  }
}));