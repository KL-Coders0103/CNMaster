import { z } from "zod";

export const changePasswordSchema =
  z
    .object({
      currentPassword:
        z.string().min(6),

      newPassword:
        z.string().min(8),

      confirmPassword:
        z.string().min(8),
    })

    .refine(
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

export type ChangePasswordForm =
  z.infer<
    typeof changePasswordSchema
  >;