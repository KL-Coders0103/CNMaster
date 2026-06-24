import { z } from "zod";

export const createPlannerTaskSchema = z.object({
    title: z.string()
        .trim()
        .min(3, "Task title must be at least 3 characters")
        .max(100, "Task title cannot exceed 100 characters"), // FIX: Typo corrected
    
    description: z.string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
    
    dueDate: z.string()
        .min(1, "Due date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format. Please select a valid date.",
        }),
});

export type CreatePlannerTaskForm = z.infer<typeof createPlannerTaskSchema>;