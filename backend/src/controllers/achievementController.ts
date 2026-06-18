import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

import {
  markAchievementAsViewed,
} from "../services/achievementService";

export const markAchievementViewedController =
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

      const achievementId =
        Array.isArray(
          req.params.achievementId
        )
          ? req.params.achievementId[0]
          : req.params.achievementId;

      const result =
        await markAchievementAsViewed(
          achievementId
        );

      res
        .status(200)
        .json(result);
    }
  );