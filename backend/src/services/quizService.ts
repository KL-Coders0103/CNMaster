import {
  QuizDifficulty,
} from "@prisma/client";

import {
  createQuizAttempt,
  getQuizHistory,
  getQuizQuestions,
  getQuizResult,
  saveQuizAnswers,
} from "../repositories/quizRepository";
import { getTodayChallenge } from "../repositories/dailyChallengeRepository";


export const startQuiz =
  async (
    userId: string,
    chapterId: string,
    difficulty: QuizDifficulty
  ) => {

    const questions =
      await getQuizQuestions(
        chapterId,
        difficulty
      );

    const attempt =
      await createQuizAttempt(
        userId,
        difficulty,
        questions.length
      );

    return {
      success: true,

      data: {
        attemptId:
          attempt.id,

        questions,
      },
    };
  };

export const submitQuiz =
  async (
    attemptId: string,
    answers: any[]
  ) => {

    const result =
      await saveQuizAnswers(
        attemptId,
        answers
      );

    return {
      success: true,
      data: result,
    };
  };

export const fetchQuizResult =
  async (
    attemptId: string
  ) => {

    const result =
      await getQuizResult(
        attemptId
      );

    return {
      success: true,
      data: result,
    };
  };

export const fetchQuizHistory =
  async (
    userId: string
  ) => {

    const history =
      await getQuizHistory(
        userId
      );

    return {
      success: true,
      data: history,
    };
  };

  export const fetchTodayChallenge =
  async () => {

    const data =
      await getTodayChallenge();

    return {
      success: true,
      data,
    };
  };