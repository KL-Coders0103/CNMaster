import { Request, Response } from "express";

import { registerSchema, verifyEmailSchema } from "../validations/authValidation";
import { registerUser, verifyEmail } from "../services/authService";

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