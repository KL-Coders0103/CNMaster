import { Request, Response } from "express";
import * as adminNotifyService from "../services/adminNotificationService";
import { AppError } from "../utils/AppError";

export const broadcastNotificationController = async (req: Request, res: Response) => {
  const { title, message, targetYear, targetBranch, targetSection } = req.body;

  if (!title || !message) {
    throw new AppError("Title and message are required", 400);
  }

  if (title.length > 100) {
    throw new AppError("Notification title cannot exceed 100 characters", 400);
  }
  if (message.length > 1000) {
    throw new AppError("Notification message cannot exceed 1000 characters", 400);
  }

  const result = await adminNotifyService.broadcastNotification({
    title,
    message,
    targetYear,
    targetBranch,
    targetSection
  });

  res.status(200).json(result);
};