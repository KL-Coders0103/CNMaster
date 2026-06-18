export interface Profile {
  id: string;
  fullName: string;
  email: string;
  mobileNumber?: string | null;
  avatarUrl?: string | null;
  year?: string | null;
  branch?: string | null;
  section?: string | null;
  provider: string;
  role: string;
  level: number;
  xpCurrent: number;
  xpRequired: number;
  streakDays: number;
  achievementCount: number;
  createdAt: string;
}

export interface ProfileCompletion {
  percentage: number;
}

export interface AchievementSummary {
  totalAchievements: number;
  unlockedAchievements: number;
  lockedAchievements: number;
  completionPercentage: number;
}

export interface ProfileSettings {
  notificationsEnabled: boolean;
  reminderEnabled: boolean;
  darkMode: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface ActivityHistory {
  date: string;
  xp: number;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  fullName: string;
  level: number;
  xp: number;
}

export interface LeaderboardResponse {
  currentUserRank: number | null;
  topUsers: LeaderboardUser[];
}