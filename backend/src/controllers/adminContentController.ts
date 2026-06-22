import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as adminContentService from "../services/adminContentService";
import { AppError } from "../utils/AppError";

export const uploadNoteController = asyncHandler(async (req: Request, res: Response) => {
  const { title, chapterId } = req.body;
  const file = req.file;

  if (!file) throw new AppError("No file provided", 400);
  if (!title || !chapterId) throw new AppError("Title and chapterId are required", 400);

  const result = await adminContentService.uploadNoteResource({ title, chapterId }, file);
  res.status(201).json(result);
});