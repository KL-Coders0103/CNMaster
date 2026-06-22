import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as studentAiService from "../services/studentAiService";
import { AppError } from "../utils/AppError";

export const askTutorController = asyncHandler(async (req: Request, res: Response) => {
  const { noteId, message } = req.body;
  const userId = req.user!.userId;

  if (!noteId || !message) {
    throw new AppError("noteId and message are required", 400);
  }

  const result = await studentAiService.askContextualTutor(userId, noteId, message);
  res.status(200).json(result);
});

export const eli5ExplainerController = asyncHandler(async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text) {
    throw new AppError("Text context is required for ELI5 breakdown", 400);
  }

  const result = await studentAiService.explainConceptEli5(text);
  res.status(200).json(result);
});