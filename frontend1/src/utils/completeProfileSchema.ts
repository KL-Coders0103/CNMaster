import { z } from "zod";

export const completeProfileSchema =
  z.object({
    mobileNumber: z
      .string()
      .regex(
        /^[0-9]{10}$/,
        "Mobile number must be exactly 10 digits"
      )
      .optional()
      .or(z.literal("")),

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
      .optional()
      .or(z.literal("")),

    confirmPassword: z
      .string()
      .optional()
      .or(z.literal("")),

    year: z
      .string()
      .trim()
      .min(
        1,
        "Year is required"
      ),

    branch: z
      .string()
      .trim()
      .min(
        1,
        "Branch is required"
      ),

    section: z
      .string()
      .trim()
      .min(
        1,
        "Section is required"
      ),
  })
  .superRefine(
    (data, ctx) => {
      const isGoogleFlow =
        !!data.mobileNumber;

      if (isGoogleFlow) {
        if (!data.password) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["password"],
            message:
              "Password is required",
          });
        }

        if (
          data.password !==
          data.confirmPassword
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [
              "confirmPassword",
            ],
            message:
              "Passwords do not match",
          });
        }
      }
    }
  );

export type CompleteProfileFormData =
  z.infer<
    typeof completeProfileSchema
  >;