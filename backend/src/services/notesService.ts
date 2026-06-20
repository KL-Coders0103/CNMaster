import { boolean } from "zod";
import {
  createBookmark,
  deleteBookmark,
  getAllSubjects,
  getBookmark,
  getBookmarkByUserAndNote,
  getChaptersBySubject,
  getNoteById,
  getNotes,
  incrementNoteDownloads,
  incrementNoteViews,
} from "../repositories/notesRepository";

import { AppError } from "../utils/AppError";

export const getSubjects = async () => {
  const subjects = await getAllSubjects();

  return {
    success: true,
    message: "Subjects fetched successfully",
    data: subjects,
  };
};

export const getChapters = async (
  subjectId: string
) => {

  const chapters =
    await getChaptersBySubject(
      subjectId
    );

  return {
    success: true,
    message:
      "Chapters fetched successfully",
    data: chapters,
  };
};

export const getAllNotes = async (
  search?: string,
  chapterId?: string
) => {

  const notes =
    await getNotes(
      search,
      chapterId
    );

  return {
    success: true,
    message:
      "Notes fetched successfully",
    data: notes.map(
      note => ({
        id: note.id,
        title: note.title,
        description:
          note.description,

        views:
          note.views,

        downloads:
          note.downloads,

        chapter:
          note.chapter.title,

        subject:
          note.chapter.subject.name,
      })
    ),
  };
};

export const getNoteDetails =
  async (
    noteId: string,
    userId?: string
  ) => {

    const note =
      await getNoteById(
        noteId
      );

    if (!note) {
      throw new AppError(
        "Note not found",
        404
      );
    }

    await incrementNoteViews(
      noteId
    );

    let bookmark = null;

    if(userId) {
      bookmark = await getBookmarkByUserAndNote(userId,noteId);
    }

    return {
      success: true,
      message:
        "Note details fetched successfully",

      data: {
        id: note.id,

        title:
          note.title,

        description:
          note.description,

        pdfUrl:
          note.pdfUrl,

        views:
          note.views + 1,

        downloads:
          note.downloads,

        chapter:
          note.chapter.title,

        subject:
          note.chapter.subject.name,

        isBookmarked: !!bookmark,
      },
    };
  };

export const bookmarkNote =
  async (
    userId: string,
    noteId: string
  ) => {

    const existing =
      await getBookmark(
        userId,
        noteId
      );

    if (
      existing
    ) {
      throw new AppError(
        "Already bookmarked",
        400
      );
    }

    await createBookmark(
      userId,
      noteId
    );

    return {
      success: true,
      message:
        "Note bookmarked successfully",
    };
  };

export const removeBookmark =
  async (
    userId: string,
    noteId: string
  ) => {

    const existing =
      await getBookmark(
        userId,
        noteId
      );

    if (
      !existing
    ) {
      throw new AppError(
        "Bookmark not found",
        404
      );
    }

    await deleteBookmark(
      userId,
      noteId
    );

    return {
      success: true,
      message:
        "Bookmark removed successfully",
    };
  };

export const registerDownload =
  async (
    noteId: string
  ) => {

    await incrementNoteDownloads(
      noteId
    );

    return {
      success: true,
      message:
        "Download registered successfully",
    };
  };