import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as adminQuizService from "../services/adminQuizService";
import { AppError } from "../utils/AppError";

export const addQuestionController = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminQuizService.addQuestion(req.body);
  res.status(201).json(result);
});

export const getQuestionsController = asyncHandler(async (req: Request, res: Response) => {
  const chapterId = req.params.chapterId as string;
  const result = await adminQuizService.getQuestionsByChapter(chapterId);
  res.status(200).json(result);
});

export const createQuizAssessmentController = asyncHandler(async (req: Request, res: Response) => {
  const { title, dueDate, timeLimit, questionLimit, xpReward, targetYear, targetBranch } = req.body;
  
  const result = await adminQuizService.createQuizAssessment({
    title,
    dueDate: new Date(dueDate),
    timeLimit: parseInt(timeLimit),
    questionLimit: parseInt(questionLimit),
    xpReward: parseFloat(xpReward),
    targetYear,
    targetBranch
  });
  
  res.status(201).json(result);
});

export const generateAiQuizController = asyncHandler(async (req: Request, res: Response) => {
  const { chapterId, sourceText, questionCount } = req.body;

  if (!chapterId || !sourceText) {
    throw new AppError("chapterId and sourceText are required", 400);
  }

  const result = await adminQuizService.generateQuizWithAi(
    chapterId, 
    sourceText, 
    parseInt(questionCount as string) || 5
  );

  res.status(200).json(result);
});