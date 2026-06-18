import { z } from "zod";

export const createPlannerTaskSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),

  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),

  dueDate: z.string().datetime("Invalid due date format"),
});

export const updatePlannerTaskSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters").optional(),

  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),

  dueDate: z.string().datetime("Invalid due date format").optional(),

  isCompleted: z.boolean().optional(),
});

export type CreatePlannerTaskInput = z.infer<typeof createPlannerTaskSchema>;

export type UpdatePlannerTaskInput = z.infer<typeof updatePlannerTaskSchema>;