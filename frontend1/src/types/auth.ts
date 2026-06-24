export type UserRole = "student" | "teacher" | "admin";

// 2. Update the base User type
export type User = {
  id: string;
  fullName: string;
  email: string;
  mobileNumber?: string | null;
  role: UserRole;
  provider: "email" | "google" | "email_google";
  googleId?: string | null;
  year?: string | null;
  branch?: string | null;
  section?: string | null;
  isProfileCompleted: boolean;
  isSuspended: boolean;
};
export interface RegisterRequest {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface CompleteProfileRequest {
  mobileNumber?: string;
  password?: string;
  year: string;
  branch: string;
  section: string;
}

export interface CompleteProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyForgotOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyForgotOtpResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface LogoutAllResponse {
  success: boolean;
  message: string;
}