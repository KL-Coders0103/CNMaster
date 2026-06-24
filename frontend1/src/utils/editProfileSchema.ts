import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z.string().min(3).optional(),

  mobileNumber: z.string()
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .optional()
    .or(z.literal("")),

  year: z.string().optional(),
  branch: z.string().optional(),
  section: z.string().optional(),
});

export type EditProfileForm = z.infer<typeof editProfileSchema>;