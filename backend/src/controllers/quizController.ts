import { Request, Response } from "express";
import * as quizService from "../services/quizService";
import { z } from "zod";
import { QuizDifficulty } from "@prisma/client";

const startQuizSchema = z.object({
  chapterId: z.string(),
  difficulty: z.nativeEnum(QuizDifficulty),
});

const submitQuizSchema = z.object({
  attemptId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedAnswer: z.string(),
    })
  ).min(1, "At least one answer is required"),
});

export const startQuizController = async (req: Request, res: Response) => {
  const payload = startQuizSchema.parse(req.body);
  const data = await quizService.startQuiz(req.user!.userId, payload.chapterId, payload.difficulty);
  res.status(200).json({ success: true, data });
};

export const submitQuizController = async (req: Request, res: Response) => {
  const payload = submitQuizSchema.parse(req.body);
  const data = await quizService.submitQuiz(req.user!.userId, payload.attemptId, payload.answers);
  res.status(200).json({ success: true, data });
};

export const getQuizResultController = async (req: Request, res: Response) => {
  const attemptId = req.params.attemptId as string;
  const data = await quizService.fetchQuizResult(attemptId);
  res.status(200).json({ success: true, data });
};

export const getQuizHistoryController = async (req: Request, res: Response) => {
  const data = await quizService.fetchQuizHistory(req.user!.userId);
  res.status(200).json({ success: true, data });
};

export const getTodayChallengeController = async (_req: Request, res: Response) => {
  const data = await quizService.fetchTodayChallenge();
  res.status(200).json({ success: true, data });
};

export const getAdaptiveQuizController = async (req: Request, res: Response) => {
  const data = await quizService.fetchAdaptiveQuiz(req.user!.userId);
  res.status(200).json({ success: true, data });
};