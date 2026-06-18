import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100),

  mobileNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Invalid mobile number")
    .optional(),

  year: z
    .string()
    .min(1),

  branch: z
    .string()
    .min(1),

  section: z
    .string()
    .min(1),
});

export const deleteProfileSchema =
  z.object({
    password:
      z.string().min(
        1,
        "Password is required"
      ),
  });
  
export const updateSettingsSchema =
  z.object({
    notificationsEnabled:
      z.boolean().optional(),

    reminderEnabled:
      z.boolean().optional(),

    darkMode:
      z.boolean().optional(),
  });

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6),

  newPassword: z
    .string()
    .min(6),

  confirmPassword: z
    .string(),
}).refine(
  data =>
    data.newPassword ===
    data.confirmPassword,
  {
    message:
      "Passwords do not match",
    path: [
      "confirmPassword",
    ],
  }
);

export type ChangePasswordInput =
  z.infer<
    typeof changePasswordSchema
  >;

export type UpdateSettingsInput =
  z.infer<
    typeof updateSettingsSchema
  >;

export type DeleteProfileInput =
  z.infer<
    typeof deleteProfileSchema
  >;

export type UpdateProfileInput =
  z.infer<typeof updateProfileSchema>;