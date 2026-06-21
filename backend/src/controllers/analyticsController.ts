import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  fetchConsistencyHeatmap,
  fetchRecentActivities,
  getWeeklyAnalytics,
} from "../services/analyticsService";
import { asyncHandler } from "../utils/asyncHandler";

export const fetchWeeklyAnalytics =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const result =
        await getWeeklyAnalytics(
          req.user!.userId
        );

      res.status(200).json(
        result
      );

    } catch (error) {

      next(error);
    }
  };

  export const getConsistencyHeatmapController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await fetchConsistencyHeatmap(
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );

  export const getRecentActivitiesController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await fetchRecentActivities(
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );