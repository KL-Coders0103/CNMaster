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
    .min(1, "Year is required"),

  branch: z
    .string()
    .trim()
    .min(1, "Branch is required"),

  section: z
    .string()
    .trim()
    .min(1, "Section is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;