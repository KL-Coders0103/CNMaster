import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import * as notesService from "../services/notesService";

export const getChaptersController = asyncHandler(async (_req: Request, res: Response) => {
  const result = await notesService.getChapters();
  res.status(200).json(result);
});

export const getNotesController = asyncHandler(async (req: Request, res: Response) => {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const chapterId = typeof req.query.chapterId === "string" ? req.query.chapterId : undefined;

  const result = await notesService.getAllNotes(search, chapterId);
  res.status(200).json(result);
});

export const getNoteDetailsController = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  const result = await notesService.getNoteDetails(noteId, req.user!.userId);
  res.status(200).json(result);
});

export const bookmarkNoteController = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  const result = await notesService.bookmarkNote(req.user!.userId, noteId);
  res.status(200).json(result);
});

export const removeBookmarkController = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  const result = await notesService.removeBookmark(req.user!.userId, noteId);
  res.status(200).json(result);
});

export const registerDownloadController = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  if (!noteId) throw new AppError("Note ID required", 400);

  const result = await notesService.registerDownload(noteId);
  res.status(200).json(result);
});

export const saveReadingProgressController = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  if (!noteId) throw new AppError("Note ID is required", 400);

  const { currentPage, totalPages } = req.body;
  const result = await notesService.saveReadingProgress(req.user!.userId, noteId, currentPage, totalPages);
  res.status(200).json(result);
});

export const getReadingProgressController = asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  if (!noteId) throw new AppError("Note ID is required", 400);

  const result = await notesService.fetchReadingProgress(req.user!.userId, noteId);
  res.status(200).json(result);
});

export const getRecentNotesController = asyncHandler(async (req: Request, res: Response) => {
  const result = await notesService.fetchRecentNotes(req.user!.userId);
  res.status(200).json(result);
});