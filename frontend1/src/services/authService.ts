import { api } from "../api/axios";

import {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  CompleteProfileResponse,
  CompleteProfileRequest,
  LoginResponse,
  LoginRequest,
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  VerifyForgotOtpResponse,
  VerifyForgotOtpRequest,
  ResetPasswordResponse,
  ResetPasswordRequest,
  RefreshTokenResponse,
  RefreshTokenRequest,
  LogoutResponse,
  LogoutRequest,
  LogoutAllResponse,
} from "../types/auth";

export const registerUser = async (
  payload: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await api.post(
    "/auth/register",
    payload
  );

  return response.data;
};

export const verifyEmail = async (
  payload: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  const response = await api.post(
    "/auth/verify-email",
    payload
  );

  return response.data;
};

export const resendOtp = async (
  payload: ResendOtpRequest
): Promise<ResendOtpResponse> => {
  const response = await api.post(
    "/auth/resend-otp",
    payload
  );

  return response.data;
};

export const completeProfile =
  async (
    payload: CompleteProfileRequest,
    accessToken: string
  ): Promise<CompleteProfileResponse> => {
    const response =
      await api.patch(
        "/auth/complete-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

    return response.data;
  };

export const loginUser =
  async (
    payload: LoginRequest
  ): Promise<LoginResponse> => {
    const response =
      await api.post(
        "/auth/login",
        payload
      );

    return response.data;
  };

export const forgotPassword =
  async (
    payload: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> => {
    const response =
      await api.post(
        "/auth/forgot-password",
        payload
      );

    return response.data;
  };

export const verifyForgotOtp =
  async (
    payload: VerifyForgotOtpRequest
  ): Promise<VerifyForgotOtpResponse> => {
    const response =
      await api.post(
        "/auth/verify-forgot-password-otp",
        payload
      );

    return response.data;
  };

export const resetPassword =
  async (
    payload: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    const response =
      await api.post(
        "/auth/reset-password",
        payload
      );

    return response.data;
  };

export const refreshAccessToken =
  async (
    payload: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    const response =
      await api.post(
        "/auth/refresh-token",
        payload
      );

    return response.data;
  };

export const logoutUser =
  async (
    payload: LogoutRequest
  ): Promise<LogoutResponse> => {
    const response =
      await api.post(
        "/auth/logout",
        payload
      );

    return response.data;
  };

export const logoutAllDevices =
  async (): Promise<LogoutAllResponse> => {
    const response =
      await api.post(
        "/auth/logout-all"
      );

    return response.data;
  };

export const googleLogin =
  async (
    payload: {
      idToken: string;
    }
  ) => {
    const response =
      await api.post(
        "/auth/google",
        payload
      );

    return response.data;
  };

