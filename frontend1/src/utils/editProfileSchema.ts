import { z } from "zod";

export const editProfileSchema =
  z.object({
    fullName:
      z.string()
        .min(3),

    mobileNumber:
      z.string()
        .min(10)
        .max(10),

    year:
      z.string(),

    branch:
      z.string(),

    section:
      z.string(),
  });

export type EditProfileForm =
  z.infer<
    typeof editProfileSchema
  >;