import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import * as assignmentService from "../services/assignmentService";

export const getAssignmentsController = asyncHandler(async (req: Request, res: Response) => {
  const chapterId = typeof req.query.chapterId === "string" ? req.query.chapterId : undefined;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;

  const result = await assignmentService.fetchAssignments(req.user!.userId, chapterId, search);
  res.status(200).json(result);
});

export const getAssignmentDetailsController = asyncHandler(async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId as string;
  const result = await assignmentService.fetchAssignmentDetails(assignmentId, req.user!.userId);
  res.status(200).json(result);
});

export const submitAssignmentController = asyncHandler(async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId as string;

  if (!req.file) {
    throw new AppError("Submission file required", 400);
  }

  const uploadResult = await assignmentService.uploadAssignmentFile(req.file);

  const result = await assignmentService.submitAssignment(
    assignmentId,
    req.user!.userId,
    uploadResult.secure_url
  );

  res.status(200).json(result);
});

export const getSubmissionHistoryController = asyncHandler(async (req: Request, res: Response) => {
  const result = await assignmentService.fetchSubmissionHistory(req.user!.userId);
  res.status(200).json(result);
});

export const getUpcomingAssignmentController = asyncHandler(async (req: Request, res: Response) => {
  const result = await assignmentService.fetchUpcomingAssignment(req.user!.userId);
  res.status(200).json(result);
});

export const getAssignmentAnalyticsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await assignmentService.fetchAssignmentAnalytics(req.user!.userId);
  res.status(200).json(result);
});