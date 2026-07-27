import { Request, Response } from "express";
import * as analyticsService from "../services/analyticsService";

export const getWeeklyAnalyticsController = async (req: Request, res: Response) => {
  const result = await analyticsService.getWeeklyAnalytics(req.user!.userId);
  res.status(200).json(result);
};

export const getLearningAnalyticsController = async (req: Request, res: Response) => {
  const result = await analyticsService.getLearningAnalytics(req.user!.userId);
  res.status(200).json(result);
};

export const getConsistencyHeatmapController = async (req: Request, res: Response) => {
  const result = await analyticsService.getConsistencyHeatmap(req.user!.userId);
  res.status(200).json(result);
};

export const getRecentActivitiesController = async (req: Request, res: Response) => {
  const result = await analyticsService.getRecentActivities(req.user!.userId);
  res.status(200).json(result);
};

export const getWeakAreasController = async (req: Request, res: Response) => {
  const result = await analyticsService.getWeakAreas(req.user!.userId);
  res.status(200).json(result);
};