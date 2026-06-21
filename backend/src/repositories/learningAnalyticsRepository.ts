import prisma from "../config/prisma";

export const getLearningAnalytics =
  async (
    userId: string
  ) => {

    // Strong Subject

    const subjectProgress =
      await prisma.userReadingProgress.groupBy({
        by: ["noteId"],

        where: {
          userId,
        },

        _count: {
          noteId: true,
        },
      });

    let strongestSubject =
      "Computer Networks";

    let weakestSubject =
      "Routing";

    // Notes completion

    const totalNotes =
      await prisma.note.count();

    const readingProgress =
      await prisma.userReadingProgress.findMany({
        where: {
          userId,
        },

        select: {
          currentPage: true,
          totalPages: true,
        },
      });

    const completedNotes =
      readingProgress.filter(
        progress =>
          progress.totalPages > 0 &&
          (
            progress.currentPage /
            progress.totalPages
          ) >= 0.9
      ).length;;

    const notesCompletion =
      totalNotes === 0
        ? 0
        : Math.round(
            (completedNotes /
              totalNotes) *
              100
          );

    // Quiz score placeholder
    // later connect quiz module

    const averageQuizScore =
      0;

    const user =
      await prisma.userStats.findUnique({
        where: {
          id: userId,
        },

        select: {
          streakDays: true,
        },
      });

    return {
      strongestSubject,
      weakestSubject,
      notesCompletion,
      averageQuizScore,
      learningStreak:
        user?.streakDays ?? 0,
    };
  };