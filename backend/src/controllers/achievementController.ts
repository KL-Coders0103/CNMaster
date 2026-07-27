import { Request, Response } from "express";
import * as achievementService from "../services/achievementService";

export const markAchievementViewedController = async (req: Request, res: Response) => {
  const userAchievementId = req.params.userAchievementId as string;
  
  const result = await achievementService.markAchievementAsViewed(userAchievementId, req.user!.userId);
  
  res.status(200).json(result);
};