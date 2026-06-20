import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

import {
  bookmarkNote,
  getAllNotes,
  getChapters,
  getNoteDetails,
  getSubjects,
  registerDownload,
  removeBookmark,
} from "../services/notesService";

export const getSubjectsController =
  asyncHandler(
    async (
      _req: Request,
      res: Response
    ) => {

      const result =
        await getSubjects();

      res.status(200).json(
        result
      );
    }
  );

export const getChaptersController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const subjectId = Array.isArray(req.params.subjectId) ? req.params.subjectId[0] :
        req.params.subjectId;

      const result =
        await getChapters(
          subjectId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getNotesController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const search =
        typeof req.query.search ===
        "string"
          ? req.query.search
          : undefined;

      const chapterId =
        typeof req.query.chapterId ===
        "string"
          ? req.query.chapterId
          : undefined;

      const result =
        await getAllNotes(
          search,
          chapterId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getNoteDetailsController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const noteId = Array.isArray(req.params.noteId)
        ? req.params.noteId[0]
        : req.params.noteId;

        if (!req.user) {
  throw new AppError(
    "Unauthorized",
    401
  );
}
      const result =
        await getNoteDetails(
          noteId,
          req.user?.userId
        );

      res.status(200).json(
        result
      );
    }
  );

export const bookmarkNoteController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const noteId = Array.isArray(req.params.noteId)
  ? req.params.noteId[0]
  : req.params.noteId;

      const result =
        await bookmarkNote(
          req.user.userId,
          noteId
        );

      res.status(200).json(
        result
      );
    }
  );

export const removeBookmarkController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const noteId = Array.isArray(req.params.noteId)
  ? req.params.noteId[0]
  : req.params.noteId;

      const result =
        await removeBookmark(
          req.user.userId,
          noteId
        );

      res.status(200).json(
        result
      );
    }
  );

export const registerDownloadController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const noteId =
        Array.isArray(
          req.params.noteId
        )
          ? req.params.noteId[0]
          : req.params.noteId;

      if (!noteId) {
        throw new AppError(
          "Note ID required",
          400
        );
      }

      const result =
        await registerDownload(
          noteId
        );

      res.status(200).json(
        result
      );
    }
  );