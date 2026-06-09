import { Request, Response } from "express";

import { loginSchema, registerSchema, verifyEmailSchema, refreshTokenSchema, logoutSchema } from "../validations/authValidation";
import { loginUser, registerUser, verifyEmail, refreshAccessToken, logoutUser, logoutAllUser } from "../services/authService";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const result = await registerUser(validatedData);

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyEmailController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData =
      verifyEmailSchema.parse(req.body);

    const result =
      await verifyEmail(validatedData);

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(
      req.body
    );

    const result = await loginUser(
      validatedData
    );

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const refreshAccessTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);

    const result = await refreshAccessToken(validatedData);

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logoutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData =
      logoutSchema.parse(req.body);

    const result = await logoutUser(
      validatedData
    );

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logoutAllController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    const result = await logoutAllUser(
      req.user.userId
    );

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};