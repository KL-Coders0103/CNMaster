import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

import {
  fetchReadingProgress,
  fetchRecentNotes,
  saveReadingProgress,
} from "../services/readingProgressService";

export const saveReadingProgressController =
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

      const noteId =
        Array.isArray(req.params.noteId)
          ? req.params.noteId[0]
          : req.params.noteId;

      if (!noteId) {
        throw new AppError(
          "Note ID is required",
          400
        );
      }

      const {
        currentPage,
        totalPages,
      } = req.body;

      const result =
        await saveReadingProgress(
          req.user.userId,
          noteId,
          currentPage,
          totalPages
        );

      res.status(200).json(
        result
      );
    }
  );

export const getReadingProgressController =
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

      const noteId =
        Array.isArray(req.params.noteId)
          ? req.params.noteId[0]
          : req.params.noteId;

      if (!noteId) {
        throw new AppError(
          "Note ID is required",
          400
        );
      }

      const result =
        await fetchReadingProgress(
          req.user.userId,
          noteId
        );

      res.status(200).json(
        result
      );
    }
  );

export const getRecentNotesController =
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

      const result =
        await fetchRecentNotes(
          req.user.userId
        );

      res.status(200).json(
        result
      );
    }
  );