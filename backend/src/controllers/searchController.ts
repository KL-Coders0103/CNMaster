import { Request, Response } from "express";
import * as searchService from "../services/searchService";
import { AppError } from "../utils/AppError";

export const globalSearchController = async (req: Request, res: Response) => {
  let query = typeof req.query.q === "string" ? req.query.q : "";

  if(query.length > 100){
    throw new AppError("Search query is too long. Please  limit to 100 characters", 400);
  }
  
  const result = await searchService.globalSearch(query);
  res.status(200).json(result);
};