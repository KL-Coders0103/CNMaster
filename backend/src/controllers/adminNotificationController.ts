import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as adminNotifyService from "../services/adminNotificationService";
import { AppError } from "../utils/AppError";

export const broadcastNotificationController = asyncHandler(async (req: Request, res: Response) => {
  const { title, message, targetYear, targetBranch, targetSection } = req.body;

  if (!title || !message) {
    throw new AppError("Title and message are required", 400);
  }

  const result = await adminNotifyService.broadcastNotification({
    title,
    message,
    targetYear,
    targetBranch,
    targetSection
  });

  res.status(200).json(result);
});