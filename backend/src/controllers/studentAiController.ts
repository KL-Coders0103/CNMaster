import { Request, Response } from "express";
import * as studentAiService from "../services/studentAiService";
import { AppError } from "../utils/AppError";

export const askTutorController = async (req: Request, res: Response) => {
  const { noteId, message } = req.body;
  if (!noteId || !message) throw new AppError("noteId and message are required", 400);

  if (message.length > 500) {
    throw new AppError("Message is too long. Please limit your question to 500 characters.", 400);
  }

  const result = await studentAiService.askContextualTutor(req.user!.userId, noteId, message);
  res.status(200).json(result);
};

export const eli5ExplainerController = async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) throw new AppError("Text context is required for ELI5 breakdown", 400);

  if (text.length > 3000) {
    throw new AppError("Text is too long for ELI5 generation. Please select a smaller concept.", 400);
  }

  const result = await studentAiService.explainConceptEli5(text);
  res.status(200).json(result);
};