import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as analyticsService from "../services/analyticsService";

export const getWeeklyAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await analyticsService.getWeeklyAnalytics(req.user!.userId);
  res.status(200).json(result);
});

export const getLearningAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await analyticsService.getLearningAnalytics(req.user!.userId);
  res.status(200).json(result);
});

export const getConsistencyHeatmapController = asyncHandler(async (req: Request, res: Response) => {
  const result = await analyticsService.getConsistencyHeatmap(req.user!.userId);
  res.status(200).json(result);
});

export const getRecentActivitiesController = asyncHandler(async (req: Request, res: Response) => {
  const result = await analyticsService.getRecentActivities(req.user!.userId);
  res.status(200).json(result);
});

export const getWeakAreasController = asyncHandler(async (req: Request, res: Response) => {
  const result = await analyticsService.getWeakAreas(req.user!.userId);
  res.status(200).json(result);
});