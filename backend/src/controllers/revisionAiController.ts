import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as revisionAiService from "../services/revisionAiService";

export const generatePlannerTasksController = asyncHandler(async (req: Request, res: Response) => {
  const result = await revisionAiService.generateSmartStudyPlan(req.user!.userId);
  res.status(200).json(result);
});

export const getFlashcardsController = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;  
  const result = await revisionAiService.generateNoteFlashcards(noteId);
  res.status(200).json(result);
});