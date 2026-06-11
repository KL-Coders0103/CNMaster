import { Request, Response } from "express";

import {
  completeProfileSchema,
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  verifyForgotPasswordOtpSchema,
} from "../validations/authValidation";

import {
  completeProfile,
  forgotPassword,
  googleLogin,
  loginUser,
  logoutAllUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendOtp,
  resetPassword,
  verifyEmail,
  verifyForgotPasswordOtp,
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

export const completeProfileController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      if (!req.user) {
        throw new AppError(
          "Unauthorized",
          401
        );
      }

      const validatedData =
        completeProfileSchema.parse(
          req.body
        );

      const result =
        await completeProfile(
          req.user.userId,
          validatedData
        );

      res.status(200).json(result);
    }
  );

export const resendOtpController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const validatedData =
        resendOtpSchema.parse(
          req.body
        );

      const result =
        await resendOtp(
          validatedData
        );

      res.status(200).json(
        result
      );
    }
  );

export const forgotPasswordController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const validatedData =
        forgotPasswordSchema.parse(
          req.body
        );

      const result =
        await forgotPassword(
          validatedData
        );

      res.status(200).json(
        result
      );
    }
  );

export const verifyForgotPasswordOtpController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const validatedData =
        verifyForgotPasswordOtpSchema.parse(
          req.body
        );

      const result =
        await verifyForgotPasswordOtp(
          validatedData
        );

      res.status(200).json(
        result
      );
    }
  );

export const resetPasswordController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const validatedData =
        resetPasswordSchema.parse(
          req.body
        );

      const result =
        await resetPassword(
          validatedData
        );

      res.status(200).json(
        result
      );
    }
  );

export const googleLoginController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const validatedData =
        googleLoginSchema.parse(
          req.body
        );

      const result =
        await googleLogin(
          validatedData
        );

      res.status(200).json(
        result
      );
    }
  );