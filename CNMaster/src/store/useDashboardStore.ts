import { create } from 'zustand';
import { api } from '../services/api';
import { DashboardData } from '../types';

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboard: (background?: boolean) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  isLoading: true,
  error: null,

  fetchDashboard: async (background = false) => {
    if (!background) set({ isLoading: true, error: null });

    try {
      const response = await api.get('dashboard/home'); 
      if (response.data?.success) {
        set({ data: response.data.data, isLoading: false });
      }
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Failed to load dashboard', 
        isLoading: false 
      });
    }
  },
}));