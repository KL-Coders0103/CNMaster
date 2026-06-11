import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),
});

export type ForgotPasswordFormData =
  z.infer<typeof forgotPasswordSchema>;