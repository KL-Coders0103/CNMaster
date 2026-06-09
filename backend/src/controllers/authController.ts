import { Request, Response } from "express";

import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  verifyEmailSchema,
} from "../validations/authValidation";

import {
  loginUser,
  logoutAllUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyEmail,
} from "../services/authService";

import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);

    const result = await registerUser(validatedData);

    res.status(201).json(result);
  }
);

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = verifyEmailSchema.parse(req.body);

    const result = await verifyEmail(validatedData);

    res.status(200).json(result);
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    res.status(200).json(result);
  }
);

export const refreshAccessTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = refreshTokenSchema.parse(req.body);

    const result = await refreshAccessToken(validatedData);

    res.status(200).json(result);
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = logoutSchema.parse(req.body);

    const result = await logoutUser(validatedData);

    res.status(200).json(result);
  }
);

export const logoutAllController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await logoutAllUser(req.user.userId);

    res.status(200).json(result);
  }
);