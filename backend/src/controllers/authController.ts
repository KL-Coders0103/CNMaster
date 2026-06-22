import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/authService";
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

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  const result = await authService.registerUser(validatedData);
  res.status(201).json(result);
});

export const verifyEmailController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = verifyEmailSchema.parse(req.body);
  const result = await authService.verifyEmail(validatedData);
  res.status(200).json(result);
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const result = await authService.loginUser(validatedData);
  res.status(200).json(result);
});

export const refreshAccessTokenController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = refreshTokenSchema.parse(req.body);
  const result = await authService.refreshAccessToken(validatedData);
  res.status(200).json(result);
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = logoutSchema.parse(req.body);
  const result = await authService.logoutUser(validatedData);
  res.status(200).json(result);
});

export const logoutAllController = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.logoutAllUser(req.user!.userId);
  res.status(200).json(result);
});

export const completeProfileController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = completeProfileSchema.parse(req.body);
  const result = await authService.completeProfile(req.user!.userId, validatedData);
  res.status(200).json(result);
});

export const resendOtpController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = resendOtpSchema.parse(req.body);
  const result = await authService.resendOtp(validatedData);
  res.status(200).json(result);
});

export const forgotPasswordController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = forgotPasswordSchema.parse(req.body);
  const result = await authService.forgotPassword(validatedData);
  res.status(200).json(result);
});

export const verifyForgotPasswordOtpController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = verifyForgotPasswordOtpSchema.parse(req.body);
  const result = await authService.verifyForgotPasswordOtp(validatedData);
  res.status(200).json(result);
});

export const resetPasswordController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = resetPasswordSchema.parse(req.body);
  const result = await authService.resetPassword(validatedData);
  res.status(200).json(result);
});

export const googleLoginController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = googleLoginSchema.parse(req.body);
  const result = await authService.googleLogin(validatedData);
  res.status(200).json(result);
});