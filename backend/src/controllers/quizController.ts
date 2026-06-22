import {
  Request,
  Response,
} from "express";


import {
  fetchQuizHistory,
  fetchQuizResult,
  fetchTodayChallenge,
  startQuiz,
  submitQuiz,
} from "../services/quizService";
import { asyncHandler } from "../utils/asyncHandler";
import { fetchAdaptiveQuiz } from "../services/adaptiveQuizService";

export const startQuizController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        chapterId,
        difficulty,
      } = req.body;

      const result =
        await startQuiz(
          req.user!.userId,
          chapterId,
          difficulty
        );

      res.status(200).json(
        result
      );
    }
  );

export const submitQuizController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        attemptId,
        answers,
      } = req.body;

      const result =
        await submitQuiz(
          attemptId,
          answers
        );

      res.status(200).json(
        result
      );
    }
  );

export const getQuizResultController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const attemptId =
        Array.isArray(
          req.params.attemptId
        )
          ? req.params.attemptId[0]
          : req.params.attemptId;

      const result =
        await fetchQuizResult(
          attemptId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getQuizHistoryController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const result =
        await fetchQuizHistory(
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );

  export const getTodayChallengeController =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const result =
        await fetchTodayChallenge();

      res.status(200).json(
        result
      );
    }
  );

  export const getAdaptiveQuizController =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const result =
        await fetchAdaptiveQuiz(
          req.user!.userId
        );

      res.status(200).json(
        result
      );
    }
  );