import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";
import {
  createUserSettings,
    deleteUserAccount,
    getAchievementSummary,
    getActivityHistory,
    getAllAchievements,
  getLeaderboardData,
  getProfileAnalytics,
  getProfileByUserId,
  getProfileCompletionData,
  getStreakAnalytics,
  getUserAchievements,
  getUserAvatar,
  getUserById,
  getUserPassword,
  getUserSettings,
  removeAvatar,
  updateAvatar,
  updatePassword,
  updateProfileByUserId,
  updateUserSettings,
} from "../repositories/profileRepository";
import { ChangePasswordInput, UpdateProfileInput, UpdateSettingsInput } from "../validations/profileValidation";
import { formatLocalDate } from "../utils/dateUtils";
import sharp from "sharp";
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const getProfile = async (userId: string) => {
    
    const user = await getProfileByUserId(userId);
    
    if (!user) {
        throw new AppError("User not found",404);
    }

    return {
      success: true,
      message: "Profile fetched successfully",
      data: {
        id: user.id,
        fullName:user.fullName,
        email:user.email,
        mobileNumber:user.mobileNumber,
        avatarUrl: user.avatarUrl,
        year:user.year,
        branch:user.branch,
        section:user.section,
        provider:user.provider,
        role:user.role,
        level:user.userStats?.level ?? 1,
        xpCurrent:user.userStats?.xpCurrent ?? 0,
        xpRequired:user.userStats?.xpRequired ?? 100,
        streakDays:user.userStats?.streakDays ?? 0,
        achievementCount:user.userAchievements.length,
        createdAt:user.createdAt,
      },
    };
  };

export const updateProfile =
  async (
    userId: string,
    payload: UpdateProfileInput
  ) => {

    const user =
      await updateProfileByUserId(
        userId,
        payload
      );

    return {
      success: true,
      message:
        "Profile updated successfully",

      data: {
        user,
      },
    };
  };

export const getProfileAchievements =
  async (
    userId: string
  ) => {

    const [
      unlockedAchievements,
      allAchievements,
    ] = await Promise.all([
      getUserAchievements(
        userId
      ),

      getAllAchievements(),
    ]);

    const unlockedIds =
      new Set(
        unlockedAchievements.map(
          achievement =>
            achievement.achievementId
        )
      );

    const achievements =
      allAchievements.map(
        achievement => {

          const unlocked =
            unlockedAchievements.find(
              item =>
                item.achievementId ===
                achievement.id
            );

          return {
            id:
              achievement.id,

            code:
              achievement.code,

            title:
              achievement.title,

            description:
              achievement.description,

            xpReward:
              achievement.xpReward,

            unlocked:
              unlockedIds.has(
                achievement.id
              ),

            unlockedAt:
              unlocked?.unlockedAt ??
              null,
          };
        }
      );

    return {
      success: true,
      message:
        "Achievements fetched successfully",

      data: achievements,
    };
  };

export const getUserAnalytics =
  async (
    userId: string
  ) => {

    const analytics =
      await getProfileAnalytics(
        userId
      );

    return {
      success: true,
      message:
        "Analytics fetched successfully",

      data: {

        level:
          analytics.userStats?.level ?? 1,

        currentXp:
          analytics.userStats?.xpCurrent ?? 0,

        xpRequired:
          analytics.userStats?.xpRequired ?? 100,

        currentStreak:
          analytics.userStats?.streakDays ?? 0,

        achievementsUnlocked:
          analytics.achievementCount,

        tasksCompleted:
          analytics.completedTasks,

        totalXpEarned:
          analytics.totalXpEarned,
      },
    };
  };

export const getUserStreakAnalytics =
  async (
    userId: string
  ) => {

    const result =
      await getStreakAnalytics(
        userId
      );

    const activities =
      result.activities;

    const totalActiveDays =
      activities.length;

    const consistency =
      totalActiveDays === 0
        ? 0
        : Math.round(
            (
              totalActiveDays /
              90
            ) * 100
          );

    const lastActivity =
      activities.length > 0
        ? activities[
            activities.length - 1
          ].date
        : null;

    return {
      success: true,
      message:
        "Streak analytics fetched successfully",

      data: {
        currentStreak:
          result.userStats?.streakDays ?? 0,

        totalActiveDays,

        consistency,

        lastActivity,
      },
    };
  };

export const getLeaderboard =
  async (
    userId: string
  ) => {

    const {
      users,
    } =
      await getLeaderboardData(
        userId
      );

    const leaderboard =
      users
        .map(user => ({
          id: user.id,
          fullName: user.fullName,
          level:
            user.userStats?.level ?? 1,
          xp:
            user.userStats?.xpCurrent ?? 0,
        }))
        .sort(
          (a, b) => {

            if (
              b.xp !== a.xp
            ) {
              return b.xp - a.xp;
            }

            return (
              b.level - a.level
            );
          }
        )
        .map(
          (
            user,
            index
          ) => ({
            rank:
              index + 1,
            ...user,
          })
        );

    const currentUser =
      leaderboard.find(
        user =>
          user.id === userId
      );

    return {
      success: true,
      message:
        "Leaderboard fetched successfully",

      data: {
        currentUserRank:
          currentUser?.rank ??
          null,

        topUsers:
          leaderboard.slice(
            0,
            50
          ),
      },
    };
  };

export const getUserActivityHistory =
  async (
    userId: string
  ) => {

    const activities =
      await getActivityHistory(
        userId
      );

    return {
      success: true,
      message:
        "Activity history fetched successfully",

      data: activities.map(
        activity => ({
          date:
            formatLocalDate(
              activity.date
            ),

          xp:
            activity.xpGained,
        })
      ),
    };
  };

export const getUserAchievementSummary =
  async (
    userId: string
  ) => {

    const summary =
      await getAchievementSummary(
        userId
      );

    const completionPercentage =
      summary.totalAchievements === 0
        ? 0
        : Math.round(
            (
              summary.unlockedAchievements /
              summary.totalAchievements
            ) * 100
          );

    return {
      success: true,
      message:
        "Achievement summary fetched successfully",

      data: {
        totalAchievements:
          summary.totalAchievements,

        unlockedAchievements:
          summary.unlockedAchievements,

        lockedAchievements:
          summary.totalAchievements -
          summary.unlockedAchievements,

        completionPercentage,
      },
    };
  };

export const deleteProfile =
  async (
    userId: string,
    password: string
  ) => {

    const user =
      await getUserById(
        userId
      );

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    if (!user.password) {
      throw new AppError(
        "Password verification unavailable for this account",
        400
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (
      !isPasswordValid
    ) {
      throw new AppError(
        "Incorrect password",
        400
      );
    }

    await deleteUserAccount(
      userId
    );

    return {
      success: true,
      message:
        "Account deleted successfully",
    };
  };

export const getProfileSettings =
  async (
    userId: string
  ) => {

    let settings =
      await getUserSettings(
        userId
      );

    if (!settings) {

      settings =
        await createUserSettings(
          userId
        );
    }

    return {
      success: true,
      message:
        "Settings fetched successfully",

      data: settings,
    };
  };

export const updateProfileSettings =
  async (
    userId: string,
    payload: UpdateSettingsInput
  ) => {

    let settings =
      await getUserSettings(
        userId
      );

    if (!settings) {

      settings =
        await createUserSettings(
          userId
        );
    }

    const updated =
      await updateUserSettings(
        userId,
        payload
      );

    return {
      success: true,
      message:
        "Settings updated successfully",

      data: updated,
    };
  };

export const uploadProfileAvatar =
  async (
    userId: string,
    file: Express.Multer.File
  ) => {

    if (!file) {
      throw new AppError(
        "Avatar is required",
        400
      );
    }

    const currentAvatar = await getUserAvatar(userId);

    if(currentAvatar?.avatarPublicId) {
      await cloudinary.uploader.destroy(currentAvatar.avatarPublicId);
    }

    console.log("1. File received", file.originalname);

const compressedImage = await sharp(file.buffer)
  .resize(400, 400)
  .jpeg({ quality: 80 })
  .toBuffer();

console.log("2. Image compressed");

console.log("3. Uploading to cloudinary");

const uploadResult =
  await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder: "cn-master/avatars",
          },
          (error, result) => {
            console.log(
              "4. Cloudinary callback fired"
            );

            if (error) {
              console.log(error);
              return reject(error);
            }

            if (!result) {
              return reject(
                new Error("No result")
              );
            }

            resolve(result);
          }
        );

      stream.end(compressedImage);
    }
  );

console.log("5. Upload success");
    

      await updateAvatar(userId, uploadResult.secure_url, uploadResult.public_id);

    return {
      success: true,
      message:
        "Avatar uploaded successfully",

      data: {
        avatarUrl:
          uploadResult.secure_url,
      },
    };
  };


export const changePassword =
  async (
    userId: string,
    payload: ChangePasswordInput
  ) => {

    const user =
      await getUserPassword(
        userId
      );

    if (
      !user?.password
    ) {

      throw new AppError(
        "Password not found",
        400
      );
    }

    const isValid =
      await bcrypt.compare(
        payload.currentPassword,
        user.password
      );

    if (
      !isValid
    ) {

      throw new AppError(
        "Current password is incorrect",
        400
      );
    }

    const isSame = await bcrypt.compare(payload.newPassword, user.password);

    if(isSame) {
      throw new AppError("New Password cannot be the same as your current password", 400);
    }

    const hashedPassword =
      await bcrypt.hash(
        payload.newPassword,
        12
      );

    await updatePassword(
      userId,
      hashedPassword
    );

    return {
      success: true,
      message:
        "Password updated successfully",
    };
  };

export const removeProfileAvatar =
  async (
    userId: string
  ) => {

    const user =
      await getUserAvatar(
        userId
      );

    if (
      !user?.avatarPublicId
    ) {

      throw new AppError(
        "Avatar not found",
        404
      );
    }

    await cloudinary.uploader.destroy(
      user.avatarPublicId
    );

    await removeAvatar(
      userId
    );

    return {
      success: true,
      message:
        "Avatar removed successfully",
    };
  };

export const getProfileCompletion =
  async (
    userId: string
  ) => {

    const profile =
      await getProfileCompletionData(
        userId
      );

    if (!profile) {
      throw new AppError(
        "User not found",
        404
      );
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

    const completed =
      fields.filter(Boolean)
        .length;

    const percentage =
      Math.round(
        (completed /
          fields.length) *
          100
      );

    return {
      success: true,
      data: {
        percentage,
      },
    };
  };