import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),

  mobileNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),

  year: z
    .string()
    .trim()
    .optional(),

  branch: z
    .string()
    .trim()
    .optional(),

  section: z
    .string()
    .trim()
    .optional(),
});

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),

  otp: z
    .string()
    .regex(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or mobile number is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .trim()
    .min(1, "Refresh token is required"),
});

export const logoutSchema = z.object({
  refreshToken: z
    .string()
    .trim()
    .min(1, "Refresh token is required"),
});

export const resendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((email) =>
      email.toLowerCase()
    ),
});

export const completeProfileSchema =
  z.object({
    year: z
      .string()
      .trim()
      .min(1, "Year is required"),

    branch: z
      .string()
      .trim()
      .min(1, "Branch is required"),

    section: z
      .string()
      .trim()
      .min(1, "Section is required"),

    mobileNumber: z
      .string()
      .regex(
        /^[0-9]{10}$/,
        "Mobile number must be exactly 10 digits"
      )
      .optional(),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /[0-9]/,
        "Password must contain at least one number"
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .optional(),
  });

export const forgotPasswordSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .transform((email) =>
        email.toLowerCase()
      ),
  });

export const verifyForgotPasswordOtpSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .transform((email) =>
        email.toLowerCase()
      ),

    otp: z
      .string()
      .regex(
        /^[0-9]{6}$/,
        "OTP must be exactly 6 digits"
      ),
  });

export const resetPasswordSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .transform((email) =>
        email.toLowerCase()
      ),

    otp: z
      .string()
      .regex(
        /^[0-9]{6}$/,
        "OTP must be exactly 6 digits"
      ),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /[0-9]/,
        "Password must contain at least one number"
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
  });

  export const googleLoginSchema =
  z.object({
    idToken:
      z.string().min(1),
  });

  
  
  export type RegisterInput = z.infer<typeof registerSchema>;
  
  export type VerifyEmailInput = z.infer<
  typeof verifyEmailSchema
  >;
  
  export type LoginInput = z.infer<
  typeof loginSchema
  >;
  
  export type RefreshTokenInput = z.infer<
  typeof refreshTokenSchema
  >;
  
  export type LogoutInput = z.infer<
  typeof logoutSchema
  >;
  
  export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
  
  export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
  
  export type ForgotPasswordInput =
  z.infer<
  typeof forgotPasswordSchema
  >;
  
  export type VerifyForgotPasswordOtpInput =
  z.infer<
  typeof verifyForgotPasswordOtpSchema
  >;
  
  export type ResetPasswordInput =
  z.infer<
  typeof resetPasswordSchema
  >;

  export type GoogleLoginInput = z.infer<
    typeof googleLoginSchema
  >;