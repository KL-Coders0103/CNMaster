import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as adminAnalyticsService from "../services/adminAnalyticsService";

export const getDashboardStatsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminAnalyticsService.getOverallDashboardStats();
  res.status(200).json(result);
});

export const getAdminLeaderboardController = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50; 
  const result = await adminAnalyticsService.getAdminLeaderboard(limit);
  res.status(200).json(result);
});

export const getIndividualStudentAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string; 
  const result = await adminAnalyticsService.getIndividualStudentAnalytics(userId);
  res.status(200).json(result);
});