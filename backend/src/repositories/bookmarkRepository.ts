import prisma from "../config/prisma";

export const toggleBookmark =
  async (
    userId: string,
    questionId: string
  ) => {

    const existing =
      await prisma.bookmarkedQuestion.findUnique({
        where: {
          userId_questionId: {
            userId,
            questionId,
          },
        },
      });

    if (existing) {

      await prisma.bookmarkedQuestion.delete({
        where: {
          id: existing.id,
        },
      });

      return {
        bookmarked: false,
      };
    }

    await prisma.bookmarkedQuestion.create({
      data: {
        userId,
        questionId,
      },
    });

    return {
      bookmarked: true,
    };
  };

export const getBookmarkedQuestions =
  async (
    userId: string
  ) => {

    return prisma.bookmarkedQuestion.findMany({
      where: {
        userId,
      },

      include: {
        question: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };