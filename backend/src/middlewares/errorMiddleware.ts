import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../utils/AppError";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  /*
  |--------------------------------------------------------------------------
  | Custom App Errors
  |--------------------------------------------------------------------------
  */

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Zod Validation Errors
  |--------------------------------------------------------------------------
  */

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Unknown Errors
  |--------------------------------------------------------------------------
  */

  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};