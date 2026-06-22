import prisma from "../config/prisma";
import { Question } from "@prisma/client";

export const generateAdaptiveQuiz =
  async (
    userId: string
  ) => {

    const weakAreas =
      await prisma.weakArea.findMany({
        where: {
          userId,
        },

        include: {
          chapter: true,
        },

        orderBy: {
          mistakeCount: "desc",
        },

        take: 3,
      });

    const weakChapterIds =
      weakAreas.map(
        area => area.chapterId
      );

    let questions: Question[] = [];

    if (
      weakChapterIds.length > 0
    ) {

      questions =
        await prisma.question.findMany({
          where: {
            chapterId: {
              in: weakChapterIds,
            },
          },

          take: 10,

          orderBy: {
            createdAt: "desc",
          },
        });
    }

    if (
      questions.length < 10
    ) {

      const extraQuestions =
        await prisma.question.findMany({
          take:
            10 - questions.length,
        });

      questions = [
        ...questions,
        ...extraQuestions,
      ];
    }

    return questions;
  };