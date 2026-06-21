import {
  Request,
  Response,
} from "express";


import {
  fetchLearningAnalytics,
} from "../services/learningAnalyticsService";
import { asyncHandler } from "../utils/asyncHandler";

export const getLearningAnalyticsController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await fetchLearningAnalytics(
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );