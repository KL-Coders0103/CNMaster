import { Request, Response } from "express";
import * as adminAnalyticsService from "../services/adminAnalyticsService";
import { AppError } from "../utils/AppError";

const getStringParam = (param: any): string => {
  const value = Array.isArray(param) ? param[0] : param;
  if (typeof value !== "string" || !value) {
    throw new AppError("Missing or invalid required parameter", 400);
  }
  return value;
};

const getNumericLimit = (param: any, defaultLimit: number, maxLimit: number): number => {
  const value = Array.isArray(param) ? param[0] : param;
  const stringValue = typeof value === "string" ? value : String(defaultLimit);
  
  const parsed = parseInt(stringValue, 10);
  return Math.min(isNaN(parsed) ? defaultLimit : parsed, maxLimit);
};

export const getDashboardStatsController = async (req: Request, res: Response) => {
  const result = await adminAnalyticsService.getOverallDashboardStats();
  res.status(200).json(result);
};

export const getAdminLeaderboardController = async (req: Request, res: Response) => {
  const limit = getNumericLimit(req.query.limit, 50, 100); 
  const result = await adminAnalyticsService.getAdminLeaderboard(limit);
  res.status(200).json(result);
};

export const getIndividualStudentAnalyticsController = async (req: Request, res: Response) => {
  const userId = getStringParam(req.params.userId); 
  const result = await adminAnalyticsService.getIndividualStudentAnalytics(userId);
  res.status(200).json(result);
};