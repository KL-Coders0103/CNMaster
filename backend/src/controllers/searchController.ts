import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as searchService from "../services/searchService";

export const globalSearchController = asyncHandler(async (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" ? req.query.q : "";
  const result = await searchService.globalSearch(query);
  res.status(200).json(result);
});