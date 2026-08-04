import { create } from 'zustand';
import { api } from '../services/api';
import { User, ProfileAnalytics, ProfileAchievementSummary, LeaderboardSummary } from '../types';
import { useAuthStore } from './useAuthStore'; 
import Toast from 'react-native-toast-message';

interface ProfileState {
  profile: User | null;
  analytics: ProfileAnalytics | null;
  achievementSummary: ProfileAchievementSummary | null;
  leaderboardRank: number | null;
  isLoading: boolean;
  
  fetchProfileData: () => Promise<void>;
  updateProfile: (data: any) => Promise<boolean>;
  logout: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  analytics: null,
  achievementSummary: null,
  leaderboardRank: null,
  isLoading: true,

  fetchProfileData: async () => {
    set({ isLoading: true });
    try {
      const [profileRes, analyticsRes, achRes, lbRes] = await Promise.all([
        api.get('/profile'),
        api.get('/profile/analytics'),
        api.get('/profile/achievement-summary'),
        api.get('/profile/leaderboard')
      ]);

      if (profileRes.data?.success) {
        set({ profile: profileRes.data.data });
        useAuthStore.getState().setUser(profileRes.data.data as User);
      }
      if (analyticsRes.data?.success) set({ analytics: analyticsRes.data.data });
      if (achRes.data?.success) set({ achievementSummary: achRes.data.data });
      if (lbRes.data?.success) set({ leaderboardRank: lbRes.data.data.currentUserRank });

    } catch (error) {
      console.error("Failed to fetch profile data", error);
      Toast.show({ type: 'error', text1: 'Failed to load profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.patch('/profile', data);
      if (response.data?.success) {
        Toast.show({ type: 'success', text1: 'Profile Updated!' });
        return true;
      }
      return false;
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Update failed', text2: error.response?.data?.message });
      return false;
    }
  },

  logout: () => {
    useAuthStore.getState().logout();
  }
}));