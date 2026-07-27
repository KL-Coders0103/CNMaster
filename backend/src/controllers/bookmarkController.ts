import { Request, Response } from "express";
import * as bookmarkService from "../services/bookmarkService";

export const toggleBookmarkController = async (req: Request, res: Response) => {
  const questionId = req.params.questionId as string;
  const result = await bookmarkService.toggleBookmark(req.user!.userId, questionId);
  res.status(200).json(result);
};

export const getBookmarksController = async (req: Request, res: Response) => {
  const result = await bookmarkService.fetchBookmarks(req.user!.userId);
  res.status(200).json(result);
};