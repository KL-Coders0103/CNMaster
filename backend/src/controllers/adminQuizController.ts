import { Request, Response } from "express";
import * as adminQuizService from "../services/adminQuizService";
import { AppError } from "../utils/AppError";

const getStringParam = (param: any): string => {
  const value = Array.isArray(param) ? param[0] : param;
  if (typeof value !== "string" || !value) {
    throw new AppError("Missing or invalid required parameter", 400);
  }
  return value;
};

export const addQuestionController = async (req: Request, res: Response) => {
  const result = await adminQuizService.addQuestion(req.body);
  res.status(201).json(result);
};

export const getQuestionsController = async (req: Request, res: Response) => {
  const chapterId = getStringParam(req.params.chapterId);
  const result = await adminQuizService.getQuestionsByChapter(chapterId);
  res.status(200).json(result);
};

export const createQuizAssessmentController = async (req: Request, res: Response) => {
  const { title, dueDate, timeLimit, questionLimit, xpReward, targetYear, targetBranch } = req.body;
  
  const parsedDate = new Date(dueDate);
  const parsedTimeLimit = parseInt(timeLimit, 10);
  const parsedQuestionLimit = parseInt(questionLimit, 10);
  const parsedXpReward = parseFloat(xpReward);

  if (isNaN(parsedDate.getTime()) || isNaN(parsedTimeLimit) || isNaN(parsedQuestionLimit) || isNaN(parsedXpReward)) {
    throw new AppError("Invalid number or date formats provided.", 400);
  }

  const result = await adminQuizService.createQuizAssessment({
    title,
    dueDate: parsedDate,
    timeLimit: parsedTimeLimit,
    questionLimit: parsedQuestionLimit,
    xpReward: parsedXpReward,
    targetYear,
    targetBranch
  });
  
  res.status(201).json(result);
};

export const generateAiQuizController = async (req: Request, res: Response) => {
  const { chapterId, sourceText, questionCount } = req.body;

  if (!chapterId || !sourceText) {
    throw new AppError("chapterId and sourceText are required", 400);
  }

  if (sourceText.length > 5000) {
    throw new AppError("Source text is too long. Please limit to 5000 characters.", 400);
  }

  const count = Math.min(parseInt(questionCount as string) || 5, 10);

  const result = await adminQuizService.generateQuizWithAi(chapterId, sourceText, count);
  res.status(200).json(result);
};