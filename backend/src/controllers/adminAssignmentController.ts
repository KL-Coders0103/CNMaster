import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as adminAssignmentService from "../services/adminAssignmentService";
import { AppError } from "../utils/AppError";
import { AssignmentFileType } from "@prisma/client";

export const createAssignmentController = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, dueDate, totalMarks, chapterId, fileType } = req.body;
  const file = req.file;

  if (!title || !dueDate || !totalMarks || !chapterId || !fileType) {
    throw new AppError("Title, dueDate, totalMarks, chapterId, and fileType are required", 400);
  }

  const result = await adminAssignmentService.createAssignment(
    { 
      title, 
      description, 
      dueDate: new Date(dueDate), 
      totalMarks: parseInt(totalMarks), 
      chapterId,
      createdById: req.user!.userId, 
      fileType: fileType as AssignmentFileType 
    },
    file
  );

  res.status(201).json(result);
});

export const getSubmissionsController = asyncHandler(async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId as string;
  const result = await adminAssignmentService.getAssignmentSubmissions(assignmentId);
  res.status(200).json(result);
});

export const gradeSubmissionController = asyncHandler(async (req: Request, res: Response) => {
  const submissionId = req.params.submissionId as string;
  const { marksObtained, feedback } = req.body;

  if (marksObtained === undefined) {
    throw new AppError("marksObtained is required", 400);
  }

  const result = await adminAssignmentService.gradeSubmission(submissionId, {
    marksObtained: parseInt(marksObtained),
    feedback,
  });

  res.status(200).json(result);
});