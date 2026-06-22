import prisma from "../config/prisma";

export const updateWeakAreas = async (userId: string, wrongQuestionIds: string[]) => {
  if (wrongQuestionIds.length === 0) return;

  const questions = await prisma.question.findMany({
    where: { id: { in: wrongQuestionIds } },
    select: { chapterId: true },
  });

  const chapterCounts: Record<string, number> = {};
  questions.forEach((q) => {
    chapterCounts[q.chapterId] = (chapterCounts[q.chapterId] || 0) + 1;
  });

  const upsertPromises = Object.entries(chapterCounts).map(([chapterId, count]) => {
    return prisma.weakArea.upsert({
      where: {
        userId_chapterId: { userId, chapterId },
      },
      update: {
        mistakeCount: { increment: count },
      },
      create: {
        userId,
        chapterId,
        mistakeCount: count,
      },
    });
  });

  await prisma.$transaction(upsertPromises);
};

export const getWeakAreas = async (userId: string) => {
  return prisma.weakArea.findMany({
    where: { userId },
    include: {
      chapter: true,
    },
    orderBy: { mistakeCount: "desc" },
    take: 5,
  });
};