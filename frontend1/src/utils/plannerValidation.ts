import { z } from "zod";

export const createPlannerTaskSchema = z.object({
    title: z.
    string().
    trim().
    min(3, "Task title must be at least 3 characters").
    max(100, "Task title connot exceed 100 characters"),
    
    description: z.
    string().
    trim().
    max(500,"description cannot exceed 500 characters").
    optional(),
    
    dueDate: z.
    string().
    min(1,"Due date is required"),
});

export type CreatePlannerTaskForm = z.infer<typeof createPlannerTaskSchema>;