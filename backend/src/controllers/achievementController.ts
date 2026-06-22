import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as achievementService from "../services/achievementService";

export const markAchievementViewedController = asyncHandler(async (req: Request, res: Response) => {
  const achievementId = req.params.achievementId as string;
  
  const result = await achievementService.markAchievementAsViewed(achievementId);
  
  res.status(200).json(result);
});