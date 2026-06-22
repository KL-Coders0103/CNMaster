import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as notifyService from "../services/notificationService";

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const result = await notifyService.fetchNotifications(req.user!.userId);
  res.status(200).json(result);
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notificationId = req.params.id as string;
  
  const result = await notifyService.markAsRead(notificationId);
  res.status(200).json(result);
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const result = await notifyService.markAllAsRead(req.user!.userId);
  res.status(200).json(result);
});