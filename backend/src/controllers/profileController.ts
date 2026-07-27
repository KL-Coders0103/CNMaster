import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import * as profileService from "../services/profileService";
import {
  changePasswordSchema,
  deleteProfileSchema,
  updateProfileSchema,
  updateSettingsSchema,
} from "../validations/profileValidation";

export const getProfileController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getProfile(req.user.userId);
  res.status(200).json(result);
};

export const updateProfileController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const payload = updateProfileSchema.parse(req.body);
  const result = await profileService.updateProfile(req.user.userId, payload);
  res.status(200).json(result);
};

export const getProfileAchievementsController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getProfileAchievements(req.user.userId);
  res.status(200).json(result);
};

export const getProfileAnalyticsController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getUserAnalytics(req.user.userId);
  res.status(200).json(result);
};

export const getProfileStreakController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getUserStreakAnalytics(req.user.userId);
  res.status(200).json(result);
};

export const getLeaderboardController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getLeaderboard(req.user.userId);
  res.status(200).json(result);
};

export const getActivityHistoryController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getUserActivityHistory(req.user.userId);
  res.status(200).json(result);
};

export const getAchievementSummaryController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getUserAchievementSummary(req.user.userId);
  res.status(200).json(result);
};

export const deleteProfileController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const payload = deleteProfileSchema.parse(req.body);
  const result = await profileService.deleteProfile(req.user.userId, payload.password);
  res.status(200).json(result);
};

export const getProfileSettingsController = async (req: Request, res: Response) => {
  const result = await profileService.getProfileSettings(req.user!.userId);
  res.status(200).json(result);
};

export const updateProfileSettingsController = async (req: Request, res: Response) => {
  const payload = updateSettingsSchema.parse(req.body);
  const result = await profileService.updateProfileSettings(req.user!.userId, payload);
  res.status(200).json(result);
};

export const uploadAvatarController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.uploadProfileAvatar(req.user.userId, req.file!);
  res.status(200).json(result);
};

export const changePasswordController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const payload = changePasswordSchema.parse(req.body);
  const result = await profileService.changePassword(req.user.userId, payload);
  res.status(200).json(result);
};

export const removeAvatarController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.removeProfileAvatar(req.user.userId);
  res.status(200).json(result);
};

export const getProfileCompletionController = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const result = await profileService.getProfileCompletion(req.user.userId);
  res.status(200).json(result);
};