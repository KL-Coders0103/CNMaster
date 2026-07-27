import { Request, Response } from "express";
import * as adminAssignmentService from "../services/adminAssignmentService";
import { AppError } from "../utils/AppError";
import { AssignmentFileType } from "@prisma/client";

const getStringParam = (param: any): string => {
  const value = Array.isArray(param) ? param[0] : param;
  if (typeof value !== "string" || !value) {
    throw new AppError("Missing or invalid required parameter", 400);
  }
  return value;
};

export const createAssignmentController = async (req: Request, res: Response) => {
  const { title, description, dueDate, totalMarks, chapterId, fileType } = req.body;
  const file = req.file;

  if (!title || !dueDate || !totalMarks || !chapterId || !fileType) {
    throw new AppError("Title, dueDate, totalMarks, chapterId, and fileType are required", 400);
  }

  const parsedDate = new Date(dueDate);
  if (isNaN(parsedDate.getTime())) {
    throw new AppError("Invalid dueDate format provided.", 400);
  }

  const result = await adminAssignmentService.createAssignment(
    { 
      title, 
      description, 
      dueDate: parsedDate, 
      totalMarks: parseInt(totalMarks, 10), 
      chapterId,
      createdById: req.user!.userId, 
      fileType: fileType as AssignmentFileType 
    },
    file
  );

  res.status(201).json(result);
};

export const getSubmissionsController = async (req: Request, res: Response) => {
  const assignmentId = getStringParam(req.params.assignmentId);
  const result = await adminAssignmentService.getAssignmentSubmissions(assignmentId);
  res.status(200).json(result);
};

export const gradeSubmissionController = async (req: Request, res: Response) => {
  const submissionId = getStringParam(req.params.submissionId);
  const { marksObtained, feedback } = req.body;

  if (marksObtained === undefined) {
    throw new AppError("marksObtained is required", 400);
  }

  const result = await adminAssignmentService.gradeSubmission(submissionId, {
    marksObtained: parseInt(marksObtained, 10),
    feedback,
  });

  res.status(200).json(result);
};