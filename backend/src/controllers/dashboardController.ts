import { Request, Response } from "express";
import * as dashboardService from "../services/dashboardService";

export const getHomeDashboardController = async (req: Request, res: Response) => {
  const result = await dashboardService.getHomeDashboard(req.user!.userId);
  res.status(200).json(result);
};