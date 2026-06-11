import { z } from "zod";

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(
      /^[0-9]{6}$/,
      "OTP must be exactly 6 digits"
    ),
});

export type VerifyOtpFormData =
  z.infer<typeof verifyOtpSchema>;