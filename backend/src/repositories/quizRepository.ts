import prisma from "../config/prisma";
import { QuizDifficulty } from "@prisma/client";
import { updateWeakAreas } from "./weakAreaRepository";

export const getQuizQuestions =
  async (
    chapterId: string,
    difficulty: QuizDifficulty,
    limit: number = 10
  ) => {

    return prisma.question.findMany({
      where: {
        chapterId,
        difficulty,
      },

      take: limit,

      select: {
        id: true,
        question: true,
        options: true,
        difficulty: true,
        marks: true,
      },
    });
  };

export const createQuizAttempt =
  async (
    userId: string,
    difficulty: QuizDifficulty,
    totalQuestions: number
  ) => {

    return prisma.quizAttempt.create({
      data: {
        userId,
        difficulty,
        totalQuestions,
      },
    });
  };


export const saveQuizAnswers =
  async (
    attemptId: string,
    answers: {
      questionId: string;
      selectedAnswer: string;
    }[]
  ) => {

    const attempt =
      await prisma.quizAttempt.findUnique({
        where: {
          id: attemptId,
        },
      });

    if (!attempt) {
      throw new Error(
        "Attempt not found"
      );
    }

    let score = 0;
    let correctAnswers = 0;

    const wrongQuestionIds:
      string[] = [];

    for (const answer of answers) {

      const question =
        await prisma.question.findUnique({
          where: {
            id: answer.questionId,
          },

          include: {
            chapter: true,
          },
        });

      if (!question) continue;

      const isCorrect =
        question.correctAnswer ===
        answer.selectedAnswer;

      if (isCorrect) {

        score += question.marks;

        correctAnswers++;

      } else {

        wrongQuestionIds.push(
          question.id
        );
      }

      await prisma.quizAnswer.create({
        data: {
          attemptId,

          questionId:
            answer.questionId,

          selectedAnswer:
            answer.selectedAnswer,

          isCorrect,
        },
      });
    }

    // Update weak areas

    if (
      wrongQuestionIds.length > 0
    ) {

      await updateWeakAreas(
        attempt.userId,
        wrongQuestionIds
      );
    }

    return prisma.quizAttempt.update({
      where: {
        id: attemptId,
      },

      data: {
        score,

        correctAnswers,

        wrongAnswers:
          answers.length -
          correctAnswers,

        totalMarks: score,

        completedAt:
          new Date(),

        status: "COMPLETED",
      },
    });
  };

export const getQuizResult =
  async (
    attemptId: string
  ) => {

    return prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
      },

      include: {
        quizAnswers: {
          include: {
            question: true,
          },
        },
      },
    });
  };

export const getQuizHistory =
  async (
    userId: string
  ) => {

    return prisma.quizAttempt.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 20,
    });
  };