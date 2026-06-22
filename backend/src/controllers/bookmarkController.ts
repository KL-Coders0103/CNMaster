import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as bookmarkService from "../services/bookmarkService";

export const toggleBookmarkController = asyncHandler(async (req: Request, res: Response) => {
  const questionId = req.params.questionId as string;
  const result = await bookmarkService.toggleBookmark(req.user!.userId, questionId);
  res.status(200).json(result);
});

export const getBookmarksController = asyncHandler(async (req: Request, res: Response) => {
  const result = await bookmarkService.fetchBookmarks(req.user!.userId);
  res.status(200).json(result);
});