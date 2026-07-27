import { Request, Response } from "express";
import * as adminGradingService from "../services/adminGradingService";
import { AppError } from "../utils/AppError";

const getStringParam = (param: any): string => {
  const value = Array.isArray(param) ? param[0] : param;
  if (typeof value !== "string" || !value) {
    throw new AppError("Missing or invalid required parameter", 400);
  }
  return value;
};

export const getSmartGradingDraftController = async (req: Request, res: Response) => {
  const submissionId = getStringParam(req.params.submissionId);
  const result = await adminGradingService.autoGradeSubmission(submissionId);
  res.status(200).json(result);
};