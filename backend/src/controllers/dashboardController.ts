import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

import {
  getHomeDashboard,
} from "../services/dashboardService";

export const getHomeDashboardController =
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
        await getHomeDashboard(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );