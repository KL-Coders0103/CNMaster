import {
  getReadingProgress,
  getRecentNotes,
  upsertReadingProgress,
} from "../repositories/readingProgressRepository";

export const saveReadingProgress =
  async (
    userId: string,
    noteId: string,
    currentPage: number,
    totalPages: number
  ) => {

    await upsertReadingProgress(
      userId,
      noteId,
      currentPage,
      totalPages
    );

    return {
      success: true,
      message:
        "Reading progress saved",
    };
  };

export const fetchReadingProgress =
  async (
    userId: string,
    noteId: string
  ) => {

    const progress =
      await getReadingProgress(
        userId,
        noteId
      );

    return {
      success: true,
      data: progress,
    };
  };

export const fetchRecentNotes =
  async (
    userId: string
  ) => {

    const notes =
      await getRecentNotes(
        userId
      );

    return {
      success: true,
      data: notes,
    };
  };