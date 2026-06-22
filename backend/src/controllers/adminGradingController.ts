import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as adminGradingService from "../services/adminGradingService";

export const getSmartGradingDraftController = asyncHandler(async (req: Request, res: Response) => {
  const submissionId = req.params.submissionId as string;
  const result = await adminGradingService.autoGradeSubmission(submissionId);
  res.status(200).json(result);
});