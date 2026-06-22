import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";
import sharp from "sharp";
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { formatLocalDate } from "../utils/dateUtils";
import { ChangePasswordInput, UpdateProfileInput, UpdateSettingsInput } from "../validations/profileValidation";

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userStats: true,
      userAchievements: { select: { id: true } },
    },
  });

  if (!user) throw new AppError("User not found", 404);

  return {
    success: true,
    message: "Profile fetched successfully",
    data: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      avatarUrl: user.avatarUrl,
      year: user.year,
      branch: user.branch,
      section: user.section,
      provider: user.provider,
      role: user.role,
      level: user.userStats?.level ?? 1,
      xpCurrent: user.userStats?.xpCurrent ?? 0,
      xpRequired: user.userStats?.xpRequired ?? 100,
      streakDays: user.userStats?.streakDays ?? 0,
      achievementCount: user.userAchievements.length,
      createdAt: user.createdAt,
    },
  };
};

export const updateProfile = async (userId: string, payload: UpdateProfileInput) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });

  return {
    success: true,
    message: "Profile updated successfully",
    data: { user },
  };
};

export const getProfileAchievements = async (userId: string) => {
  const [unlockedAchievements, allAchievements] = await Promise.all([
    prisma.userAchievement.findMany({ where: { userId } }),
    prisma.achievement.findMany({ orderBy: { xpReward: "asc" } }),
  ]);

  const unlockedMap = new Map(unlockedAchievements.map((ua) => [ua.achievementId, ua.unlockedAt]));

  const achievements = allAchievements.map((achievement) => ({
    id: achievement.id,
    code: achievement.code,
    title: achievement.title,
    description: achievement.description,
    xpReward: achievement.xpReward,
    unlocked: unlockedMap.has(achievement.id),
    unlockedAt: unlockedMap.get(achievement.id) || null,
  }));

  return {
    success: true,
    message: "Achievements fetched successfully",
    data: achievements,
  };
};

export const getUserAnalytics = async (userId: string) => {
  const [userStats, achievementCount, completedTasks, xpTransactions] = await Promise.all([
    prisma.userStats.findUnique({ where: { userId } }),
    prisma.userAchievement.count({ where: { userId } }),
    prisma.plannerTask.count({ where: { userId, isCompleted: true } }),
    prisma.xpTransaction.aggregate({ where: { userId }, _sum: { xpEarned: true } }),
  ]);

  return {
    success: true,
    message: "Analytics fetched successfully",
    data: {
      level: userStats?.level ?? 1,
      currentXp: userStats?.xpCurrent ?? 0,
      xpRequired: userStats?.xpRequired ?? 100,
      currentStreak: userStats?.streakDays ?? 0,
      achievementsUnlocked: achievementCount,
      tasksCompleted: completedTasks,
      totalXpEarned: xpTransactions._sum.xpEarned ?? 0,
    },
  };
};

export const getUserStreakAnalytics = async (userId: string) => {
  const [userStats, activities] = await Promise.all([
    prisma.userStats.findUnique({ where: { userId } }),
    prisma.dailyActivity.findMany({ where: { userId }, orderBy: { date: "asc" } }),
  ]);

  const totalActiveDays = activities.length;
  const consistency = totalActiveDays === 0 ? 0 : Math.round((totalActiveDays / 90) * 100);
  const lastActivity = activities.length > 0 ? activities[activities.length - 1].date : null;

  return {
    success: true,
    message: "Streak analytics fetched successfully",
    data: {
      currentStreak: userStats?.streakDays ?? 0,
      totalActiveDays,
      consistency,
      lastActivity,
    },
  };
};

export const getLeaderboard = async (userId: string) => {
  const topStats = await prisma.userStats.findMany({
    orderBy: [
      { xpCurrent: 'desc' },
      { level: 'desc' }
    ],
    take: 50,
    include: {
      user: { select: { id: true, fullName: true } }
    }
  });

  const leaderboard = topStats.map((stat, index) => ({
    rank: index + 1,
    id: stat.user.id,
    fullName: stat.user.fullName,
    level: stat.level,
    xp: stat.xpCurrent,
  }));

  const currentUser = leaderboard.find((u) => u.id === userId);

  return {
    success: true,
    message: "Leaderboard fetched successfully",
    data: {
      currentUserRank: currentUser?.rank ?? null,
      topUsers: leaderboard,
    },
  };
};

export const getUserActivityHistory = async (userId: string) => {
  const activities = await prisma.dailyActivity.findMany({
    where: { userId },
    orderBy: { date: "asc" },
    select: { date: true, xpGained: true },
  });

  return {
    success: true,
    message: "Activity history fetched successfully",
    data: activities.map((activity) => ({
      date: formatLocalDate(activity.date),
      xp: activity.xpGained,
    })),
  };
};

export const getUserAchievementSummary = async (userId: string) => {
  const [totalAchievements, unlockedAchievements] = await Promise.all([
    prisma.achievement.count(),
    prisma.userAchievement.count({ where: { userId } }),
  ]);

  const completionPercentage = totalAchievements === 0 
    ? 0 
    : Math.round((unlockedAchievements / totalAchievements) * 100);

  return {
    success: true,
    message: "Achievement summary fetched successfully",
    data: {
      totalAchievements,
      unlockedAchievements,
      lockedAchievements: totalAchievements - unlockedAchievements,
      completionPercentage,
    },
  };
};

export const deleteProfile = async (userId: string, password?: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.provider === "email") {
    if (!password) {
      throw new AppError("Password is required to delete an email account", 400);
    }
    if (!user.password) {
      throw new AppError("Password verification unavailable for this account", 400);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Incorrect password", 400);
    }
  }

  await prisma.user.delete({ where: { id: userId } });

  return {
    success: true,
    message: "Account deleted successfully",
  };
};

export const getProfileSettings = async (userId: string) => {
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: {}, 
    create: { userId }, 
  });

  return {
    success: true,
    message: "Settings fetched successfully",
    data: settings,
  };
};

export const updateProfileSettings = async (userId: string, payload: UpdateSettingsInput) => {
  const updatedSettings = await prisma.userSettings.upsert({
    where: { userId },
    update: payload,
    create: { userId, ...payload },
  });

  return {
    success: true,
    message: "Settings updated successfully",
    data: updatedSettings,
  };
};
export const uploadProfileAvatar = async (userId: string, file: Express.Multer.File) => {
  if (!file) {
    throw new AppError("Avatar is required", 400);
  }

  const currentAvatar = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarPublicId: true },
  });

  if (currentAvatar?.avatarPublicId) {
    await cloudinary.uploader.destroy(currentAvatar.avatarPublicId);
  }

  const compressedImage = await sharp(file.buffer)
    .resize(400, 400)
    .jpeg({ quality: 80 })
    .toBuffer();

  const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "cn-master/avatars" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result"));
        resolve(result);
      }
    );
    stream.end(compressedImage);
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: uploadResult.secure_url,
      avatarPublicId: uploadResult.public_id,
    },
  });

  return {
    success: true,
    message: "Avatar uploaded successfully",
    data: {
      avatarUrl: uploadResult.secure_url,
    },
  };
};

export const changePassword = async (userId: string, payload: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user?.password) {
    throw new AppError("Password not found", 400);
  }

  const isValid = await bcrypt.compare(payload.currentPassword, user.password);

  if (!isValid) {
    throw new AppError("Current password is incorrect", 400);
  }

  const isSame = await bcrypt.compare(payload.newPassword, user.password);

  if (isSame) {
    throw new AppError("New Password cannot be the same as your current password", 400);
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return {
    success: true,
    message: "Password updated successfully",
  };
};

export const removeProfileAvatar = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarPublicId: true },
  });

  if (!user?.avatarPublicId) {
    throw new AppError("Avatar not found", 404);
  }

  await cloudinary.uploader.destroy(user.avatarPublicId);

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: null, avatarPublicId: null },
  });

  return {
    success: true,
    message: "Avatar removed successfully",
  };
};

export const getProfileCompletion = async (userId: string) => {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      email: true,
      mobileNumber: true,
      avatarUrl: true,
      year: true,
      branch: true,
      section: true,
    },
  });

  if (!profile) {
    throw new AppError("User not found", 404);
  }

  const fields = [
    profile.fullName,
    profile.email,
    profile.mobileNumber,
    profile.avatarUrl,
    profile.year,
    profile.branch,
    profile.section,
  ];

  const completed = fields.filter(Boolean).length;
  const percentage = Math.round((completed / fields.length) * 100);

  return {
    success: true,
    data: { percentage },
  };
};