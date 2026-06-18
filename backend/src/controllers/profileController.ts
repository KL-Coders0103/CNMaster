import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

import {
  changePassword,
    deleteProfile,
    getLeaderboard,
  getProfile,
  getProfileAchievements,
  getProfileCompletion,
  getProfileSettings,
  getUserAchievementSummary,
  getUserActivityHistory,
  getUserAnalytics,
  getUserStreakAnalytics,
  removeProfileAvatar,
  updateProfile,
  updateProfileSettings,
  uploadProfileAvatar,
} from "../services/profileService";

import {
  changePasswordSchema,
    deleteProfileSchema,
  updateProfileSchema,
  updateSettingsSchema,
} from "../validations/profileValidation";

export const getProfileController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const result =
        await getProfile(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const updateProfileController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const payload =
        updateProfileSchema.parse(
          req.body
        );

      const result =
        await updateProfile(
          req.user.userId,
          payload
        );

      res.status(200).json(
        result
      );
    }
  );

export const getProfileAchievementsController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const result =
        await getProfileAchievements(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getProfileAnalyticsController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const result =
        await getUserAnalytics(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getProfileStreakController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const result =
        await getUserStreakAnalytics(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getLeaderboardController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const result =
        await getLeaderboard(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getActivityHistoryController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const result =
        await getUserActivityHistory(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getAchievementSummaryController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const result =
        await getUserAchievementSummary(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const deleteProfileController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const payload =
        deleteProfileSchema.parse(
          req.body
        );

      const result =
        await deleteProfile(
          req.user.userId,
          payload.password
        );

      res.status(200).json(
        result
      );
    }
  );

export const getProfileSettingsController =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const result =
        await getProfileSettings(
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const updateProfileSettingsController =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const payload =
        updateSettingsSchema.parse(
          req.body
        );

      const result =
        await updateProfileSettings(
          req.user!.userId,
          payload
        );

      res.status(200).json(
        result
      );
    }
  );

export const uploadAvatarController =
  asyncHandler(
    async (
      req,
      res
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const result =
        await uploadProfileAvatar(
          req.user.userId,
          req.file!
        );

      res.status(200).json(
        result
      );
    }
  );

export const changePasswordController =
  asyncHandler(
    async (
      req,
      res
    ) => {

      if (
        !req.user
      ) {

        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const payload =
        changePasswordSchema.parse(
          req.body
        );

      const result =
        await changePassword(
          req.user.userId,
          payload
        );

      res.status(200).json(
        result
      );
    }
  );

export const removeAvatarController =
  asyncHandler(
    async (
      req,
      res
    ) => {

      if (
        !req.user
      ) {

        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const result =
        await removeProfileAvatar(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getProfileCompletionController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const result =
        await getProfileCompletion(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );