import prisma from "../config/prisma";

export const getAllSubjects = async () => {
  return prisma.subject.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const getChaptersBySubject = async (
  subjectId: string
) => {
  return prisma.chapter.findMany({
    where: {
      subjectId,
    },
    orderBy: {
      title: "asc",
    },
  });
};

export const getNotes = async (
  search?: string,
  chapterId?: string
) => {
  return prisma.note.findMany({
    where: {
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),

      ...(chapterId
        ? {
            chapterId,
          }
        : {}),
    },

    include: {
      chapter: {
        include: {
          subject: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getNoteById = async (
  noteId: string
) => {
  return prisma.note.findUnique({
    where: {
      id: noteId,
    },

    include: {
      chapter: {
        include: {
          subject: true,
        },
      },
    },
  });
};

export const incrementNoteViews = async (
  noteId: string
) => {
  return prisma.note.update({
    where: {
      id: noteId,
    },

    data: {
      views: {
        increment: 1,
      },
    },
  });
};

export const getBookmark = async (
  userId: string,
  noteId: string
) => {
  return prisma.userBookmark.findUnique({
    where: {
      userId_noteId: {
        userId,
        noteId,
      },
    },
  });
};

export const createBookmark = async (
  userId: string,
  noteId: string
) => {
  return prisma.userBookmark.create({
    data: {
      userId,
      noteId,
    },
  });
};

export const deleteBookmark = async (
  userId: string,
  noteId: string
) => {
  return prisma.userBookmark.delete({
    where: {
      userId_noteId: {
        userId,
        noteId,
      },
    },
  });
};

export const getBookmarkByUserAndNote = async (
  userId: string,
  noteId: string
) => {
  return prisma.userBookmark.findUnique({
    where: {
      userId_noteId: {
        userId,
        noteId,
      },
    },
  });
};

export const incrementNoteDownloads =
  async (
    noteId: string
  ) => {

    return prisma.note.update({
      where: {
        id: noteId,
      },

      data: {
        downloads: {
          increment: 1,
        },
      },
    });
  };