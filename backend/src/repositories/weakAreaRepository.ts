import prisma from "../config/prisma";

export const updateWeakAreas =
  async (
    userId: string,
    wrongQuestionIds: string[]
  ) => {

    if (
      wrongQuestionIds.length === 0
    ) return;

    const questions =
      await prisma.question.findMany({
        where: {
          id: {
            in: wrongQuestionIds,
          },
        },

        select: {
          chapterId: true,
        },
      });

    const chapterCounts:
      Record<string, number> = {};

    questions.forEach(
      question => {

        chapterCounts[
          question.chapterId
        ] =
          (chapterCounts[
            question.chapterId
          ] || 0) + 1;
      }
    );

    for (const chapterId in chapterCounts) {

      const existingWeakArea =
        await prisma.weakArea.findFirst({
          where: {
            userId,
            chapterId,
          },
        });

      if (existingWeakArea) {

        await prisma.weakArea.update({
          where: {
            id:
              existingWeakArea.id,
          },

          data: {
            mistakeCount: {
              increment:
                chapterCounts[
                  chapterId
                ],
            },
          },
        });

      } else {

        await prisma.weakArea.create({
          data: {
            userId,
            chapterId,

            mistakeCount:
              chapterCounts[
                chapterId
              ],
          },
        });
      }
    }
  };

  export const getWeakAreas =
  async (
    userId: string
  ) => {

    return prisma.weakArea.findMany({
      where: {
        userId,
      },

      include: {
        chapter: {
          include: {
            subject: true,
          },
        },
      },

      orderBy: {
        mistakeCount: "desc",
      },

      take: 5,
    });
  };