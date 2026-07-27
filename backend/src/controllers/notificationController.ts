import { Request, Response } from "express";
import * as notifyService from "../services/notificationService";

export const getNotifications = async (req: Request, res: Response) => {
  const result = await notifyService.fetchNotifications(req.user!.userId);
  res.status(200).json(result);
};

export const markAsRead = async (req: Request, res: Response) => {
  const notificationId = req.params.id as string;
  
  const result = await notifyService.markAsRead(notificationId, req.user!.userId);
  res.status(200).json(result);
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const result = await notifyService.markAllAsRead(req.user!.userId);
  res.status(200).json(result);
};