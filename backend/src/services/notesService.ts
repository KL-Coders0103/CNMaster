import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { evaluateLearningAchievements, evaluateTimeAndRecoveryAchievements } from "./achievementEvaluator";

export const getChapters = async () => {
  const chapters = await prisma.chapter.findMany({
    orderBy: { title: "asc" },
  });

  return { success: true, message: "Chapters fetched successfully", data: chapters };
};

export const getAllNotes = async (search?: string, chapterId?: string) => {
  const notes = await prisma.note.findMany({
    where: {
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
      ...(chapterId ? { chapterId } : {}),
    },
    include: { chapter: true }, 
    orderBy: { createdAt: "desc" },
  });

  return {
    success: true,
    message: "Notes fetched successfully",
    data: notes.map((note) => ({
      id: note.id,
      title: note.title,
      description: note.description,
      views: note.views,
      downloads: note.downloads,
      chapter: note.chapter.title,
    })),
  };
};

export const getNoteDetails = async (noteId: string, userId: string) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { chapter: true }, 
  });

  if (!note) throw new AppError("Note not found", 404);

  await prisma.note.update({
    where: { id: noteId },
    data: { views: { increment: 1 } },
  });

  const bookmark = await prisma.userBookmark.findUnique({
    where: { userId_noteId: { userId, noteId } },
  });

  return {
    success: true,
    message: "Note details fetched successfully",
    data: {
      id: note.id,
      title: note.title,
      description: note.description,
      pdfUrl: note.pdfUrl,
      views: note.views + 1, 
      downloads: note.downloads,
      chapter: note.chapter.title,
      isBookmarked: !!bookmark,
    },
  };
};

export const registerDownload = async (noteId: string) => {
  await prisma.note.update({
    where: { id: noteId },
    data: { downloads: { increment: 1 } },
  });

  return { success: true, message: "Download registered successfully" };
};

export const bookmarkNote = async (userId: string, noteId: string) => {
  const existing = await prisma.userBookmark.findUnique({
    where: { userId_noteId: { userId, noteId } },
  });

  if (existing) throw new AppError("Already bookmarked", 400);

  await prisma.userBookmark.create({
    data: { userId, noteId },
  });

  return { success: true, message: "Note bookmarked successfully" };
};

export const removeBookmark = async (userId: string, noteId: string) => {
  const existing = await prisma.userBookmark.findUnique({
    where: { userId_noteId: { userId, noteId } },
  });

  if (!existing) throw new AppError("Bookmark not found", 404);

  await prisma.userBookmark.delete({
    where: { userId_noteId: { userId, noteId } },
  });

  return { success: true, message: "Bookmark removed successfully" };
};

export const saveReadingProgress = async (userId: string, noteId: string, currentPage: number, totalPages: number) => {
  await prisma.userReadingProgress.upsert({
    where: { userId_noteId: { userId, noteId } },
    update: { currentPage, totalPages, lastOpenedAt: new Date() },
    create: { userId, noteId, currentPage, totalPages },
  });

  evaluateLearningAchievements(userId).catch(console.error);
  evaluateTimeAndRecoveryAchievements(userId).catch(console.error);

  return { success: true, message: "Reading progress saved" };
};

export const fetchReadingProgress = async (userId: string, noteId: string) => {
  const progress = await prisma.userReadingProgress.findUnique({
    where: { userId_noteId: { userId, noteId } },
  });

  return { success: true, data: progress };
};

export const fetchRecentNotes = async (userId: string) => {
  const notes = await prisma.userReadingProgress.findMany({
    where: { userId },
    include: { note: true },
    orderBy: { lastOpenedAt: "desc" },
    take: 10,
  });

  return { success: true, data: notes };
};