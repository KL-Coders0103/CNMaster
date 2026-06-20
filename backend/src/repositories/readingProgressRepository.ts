import prisma from "../config/prisma";

export const upsertReadingProgress =
  async (
    userId: string,
    noteId: string,
    currentPage: number,
    totalPages: number
  ) => {

    return prisma.userReadingProgress.upsert({
      where: {
        userId_noteId: {
          userId,
          noteId,
        },
      },

      update: {
        currentPage,
        totalPages,
        lastOpenedAt: new Date(),
      },

      create: {
        userId,
        noteId,
        currentPage,
        totalPages,
      },
    });
  };

export const getReadingProgress =
  async (
    userId: string,
    noteId: string
  ) => {

    return prisma.userReadingProgress.findUnique({
      where: {
        userId_noteId: {
          userId,
          noteId,
        },
      },
    });
  };

export const getRecentNotes =
  async (
    userId: string
  ) => {

    return prisma.userReadingProgress.findMany({
      where: {
        userId,
      },

      include: {
        note: true,
      },

      orderBy: {
        lastOpenedAt: "desc",
      },

      take: 10,
    });
  };