import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import * as profileService from "../services/profileService";
import {
  changePasswordSchema,
  deleteProfileSchema,
  updateProfileSchema,
  updateSettingsSchema,
} from "../validations/profileValidation";

export const getProfileController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getProfile(req.user.userId);
  res.status(200).json(result);
});

export const updateProfileController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const payload = updateProfileSchema.parse(req.body);
  const result = await profileService.updateProfile(req.user.userId, payload);
  res.status(200).json(result);
});

export const getProfileAchievementsController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getProfileAchievements(req.user.userId);
  res.status(200).json(result);
});

export const getProfileAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getUserAnalytics(req.user.userId);
  res.status(200).json(result);
});

export const getProfileStreakController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getUserStreakAnalytics(req.user.userId);
  res.status(200).json(result);
});

export const getLeaderboardController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getLeaderboard(req.user.userId);
  res.status(200).json(result);
});

export const getActivityHistoryController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getUserActivityHistory(req.user.userId);
  res.status(200).json(result);
});

export const getAchievementSummaryController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getUserAchievementSummary(req.user.userId);
  res.status(200).json(result);
});

export const deleteProfileController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const payload = deleteProfileSchema.parse(req.body);
  const result = await profileService.deleteProfile(req.user.userId, payload.password);
  res.status(200).json(result);
});

export const getProfileSettingsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await profileService.getProfileSettings(req.user!.userId);
  res.status(200).json(result);
});

export const updateProfileSettingsController = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateSettingsSchema.parse(req.body);
  const result = await profileService.updateProfileSettings(req.user!.userId, payload);
  res.status(200).json(result);
});

export const uploadAvatarController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.uploadProfileAvatar(req.user.userId, req.file!);
  res.status(200).json(result);
});

export const changePasswordController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const payload = changePasswordSchema.parse(req.body);
  const result = await profileService.changePassword(req.user.userId, payload);
  res.status(200).json(result);
});

export const removeAvatarController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.removeProfileAvatar(req.user.userId);
  res.status(200).json(result);
});

export const getProfileCompletionController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getProfileCompletion(req.user.userId);
  res.status(200).json(result);
});