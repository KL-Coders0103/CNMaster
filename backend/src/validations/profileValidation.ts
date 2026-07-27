import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters").max(100),

  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number").optional(),

  year: z.string().trim().min(1),
  branch: z.string().trim().min(1),
  section: z.string().trim().min(1),
});

export const deleteProfileSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
  
export const updateSettingsSchema = z.object({
  notificationsEnabled: z.boolean().optional(),
  reminderEnabled: z.boolean().optional(),
  darkMode: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type DeleteProfileInput = z.infer<typeof deleteProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;