import { Request, Response } from "express";
import * as authService from "../services/authService";
import { completeProfileSchema, forgotPasswordSchema, googleLoginSchema, loginSchema, logoutSchema, refreshTokenSchema, registerSchema, resendOtpSchema,  resetPasswordSchema, verifyEmailSchema, verifyForgotPasswordOtpSchema } from "../validations/authValidation";

export const register = async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.registerUser(validatedData);res.status(201).json(result);
};

export const verifyEmailController = async (req: Request, res: Response) => {
    const validatedData = verifyEmailSchema.parse(req.body);
    const result = await authService.verifyEmail(validatedData);
    res.status(200).json(result);
};

export const loginController = async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);
    res.status(200).json(result);
};

export const refreshAccessTokenController = async (req: Request, res: Response) => {
    const validatedData = refreshTokenSchema.parse(req.body);const result = await authService.refreshAccessToken(validatedData);
    res.status(200).json(result);
};

export const logoutController = async (req: Request, res: Response) => {
    const validatedData = logoutSchema.parse(req.body);
    const result = await authService.logoutUser(validatedData);
    res.status(200).json(result);
};

export const logoutAllController = async (req: Request, res: Response) => {
    const result = await authService.logoutAllUser(req.user!.userId);
    res.status(200).json(result);
};

export const completeProfileController = async (req: Request, res: Response) => {
    const validatedData = completeProfileSchema.parse(req.body);
    const result = await authService.completeProfile(req.user!.userId, validatedData);
    res.status(200).json(result);
};

export const resendOtpController = async (req: Request, res: Response) => {
    const validatedData = resendOtpSchema.parse(req.body);
    const result = await authService.resendOtp(validatedData);
    res.status(200).json(result);
};

export const forgotPasswordController = async (req: Request, res: Response) => {
    const validatedData = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(validatedData);
    res.status(200).json(result);
};

export const verifyForgotPasswordOtpController = async (req: Request, res: Response) => {
    const validatedData = verifyForgotPasswordOtpSchema.parse(req.body);
    const result = await authService.verifyForgotPasswordOtp(validatedData);
    res.status(200).json(result);
};

export const resetPasswordController = async (req: Request, res: Response) => {
    const validatedData = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(validatedData);
    res.status(200).json(result);
};

export const googleLoginController = async (req: Request, res: Response) => {
    const validatedData = googleLoginSchema.parse(req.body);
    const result = await authService.googleLogin(validatedData);
    res.status(200).json(result);
};