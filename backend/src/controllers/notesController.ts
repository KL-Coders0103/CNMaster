import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import * as notesService from "../services/notesService";

export const getChaptersController = async (_req: Request, res: Response) => {
  const result = await notesService.getChapters();
  res.status(200).json(result);
};

export const getNotesController = async (req: Request, res: Response) => {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const chapterId = typeof req.query.chapterId === "string" ? req.query.chapterId : undefined;

  const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 50;

  const result = await notesService.getAllNotes(search, chapterId, limit);
  res.status(200).json(result);
};

export const getNoteDetailsController = async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  const result = await notesService.getNoteDetails(noteId, req.user!.userId);
  res.status(200).json(result);
};

export const bookmarkNoteController = async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  const result = await notesService.bookmarkNote(req.user!.userId, noteId);
  res.status(200).json(result);
};

export const removeBookmarkController = async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  const result = await notesService.removeBookmark(req.user!.userId, noteId);
  res.status(200).json(result);
};

export const registerDownloadController = async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  if (!noteId) throw new AppError("Note ID required", 400);

  const result = await notesService.registerDownload(noteId);
  res.status(200).json(result);
};

export const saveReadingProgressController = async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  if (!noteId) throw new AppError("Note ID is required", 400);

  const { currentPage, totalPages } = req.body;
  if (typeof currentPage !== 'number' || typeof totalPages !== 'number') {
    throw new AppError("Invalid progress data", 400);
  }

  const result = await notesService.saveReadingProgress(req.user!.userId, noteId, currentPage, totalPages);
  res.status(200).json(result);
};

export const getReadingProgressController = async (req: Request, res: Response) => {
  const noteId = req.params.noteId as string;
  if (!noteId) throw new AppError("Note ID is required", 400);

  const result = await notesService.fetchReadingProgress(req.user!.userId, noteId);
  res.status(200).json(result);
};

export const getRecentNotesController = async (req: Request, res: Response) => {
  const result = await notesService.fetchRecentNotes(req.user!.userId);
  res.status(200).json(result);
};