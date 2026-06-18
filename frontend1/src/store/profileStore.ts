import { create } from "zustand";

import {
  changePassword,
  getAchievements,
  getActivityHistory,
  getLeaderboard,
  getProfile,
  getProfileCompletion,
  getProfileSettings,
  removeAvatar,
  updateProfile,
  updateProfileSettings,
  uploadAvatar,
} from "../services/profileService";

import {
  Achievement,
  ActivityHistory,
  LeaderboardUser,
  Profile,
  ProfileSettings,
} from "../types/profile";

type ProfileState = {
  profile: Profile | null;
  completion: number;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateUserProfile: (
    payload: {
      fullName?: string;
      mobileNumber?: string;
      year?: string;
      branch?: string;
      section?: string;
    }
  ) => Promise<void>;
  uploadProfileAvatar: (imageUri: string) => Promise<void>;
  removeProfileAvatar: () => Promise<void>;
  achievements: Achievement[];
  fetchAchievements: () => Promise<void>;
  activityHistory: ActivityHistory[];
  fetchActivityHistory: () => Promise<void>;
  leaderboard: LeaderboardUser[];
  currentUserRank: number | null;
  fetchLeaderboard: () => Promise<void>;
  settings: ProfileSettings | null;
  fetchSettings: () => Promise<void>;
  saveSettings: (
    payload: {
      notificationsEnabled?: boolean;
      reminderEnabled?: boolean;
      darkMode?: boolean;
    }
  ) => Promise<void>;
  changeUserPassword: (
    payload: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }
  ) => Promise<void>;
  clearProfile: () => void;
};

export const useProfileStore =
  create<ProfileState>(
    (set, get) => ({
      profile: null,
      completion: 0,
      isLoading: false,
      achievements: [],
      activityHistory: [],
      leaderboard: [],
      currentUserRank: null,
      settings: null,

      fetchProfile:
        async () => {
          try {
            set({
              isLoading: true,
            });

            const [
              profileResponse,
              completionResponse,
            ] =
              await Promise.all([
                getProfile(),
                getProfileCompletion(),
              ]);

            set({
              profile: profileResponse.data,
              completion: completionResponse.data.percentage,
              isLoading: false,
            });
          } catch (error) {
            set({
              isLoading: false,
            });
            console.log("Profile fetch error",error);
          }
        },

      updateUserProfile: async payload => {
        await updateProfile(payload);

        await get().fetchProfile();
      },

      uploadProfileAvatar: async imageUri => {
        const formData = new FormData();

        formData.append("avatar", {
          uri: imageUri,
          type: "image/jpeg",
          name: "avatar.jpg",
        } as any );

        await uploadAvatar(formData);

        await get().fetchProfile();
      },

      removeProfileAvatar: async () => {
        await removeAvatar();
        await get().fetchProfile();
      },

      fetchAchievements: async () => {
        const response = await getAchievements();
        set({
          achievements: response.data,
        });
      },

      fetchActivityHistory: async () => {
        const response = await getActivityHistory();

        set({
          activityHistory: response.data
        });
      },

      fetchLeaderboard: async () => {
        const response = await getLeaderboard();

        set({
          leaderboard: response.data.topUsers,
          currentUserRank: response.data.currentUserRank
        });
      },

      fetchSettings: async () => {
        const response = await getProfileSettings();
        set({
          settings: response.data
        });
      },

      saveSettings: async payload => {
        const response = await updateProfileSettings(payload);
        set({
          settings: response.data
        });
      },

      changeUserPassword: async payload => {
        await changePassword(payload);
      },

      clearProfile:
        () =>
          set({
            profile: null,
            completion: 0,
          }),
    })
  );