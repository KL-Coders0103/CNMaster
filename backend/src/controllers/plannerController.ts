import { Request, Response } from "express";

import { createPlannerTask, deletePlannerTask, getPlannerCalendarDates, getPlannerTask, togglePlannnerTask, updatePlannerTask } from "../services/plannerService";
import { asyncHandler } from "../utils/asyncHandler";
import { createPlannerTaskSchema, updatePlannerTaskSchema } from "../validations/plannerValidation";
import { AppError } from "../utils/AppError";

export const createPlannerTaskController = asyncHandler(async(req: Request, res: Response) => {
    
    if(!req.user) {
        throw new AppError("Unauthorized", 401);
    }

    const payload = createPlannerTaskSchema.parse(req.body);
    
    const result = await createPlannerTask(req.user.userId, payload);

    res.status(201).json(result);
});

export const getPlannerTasksController = asyncHandler(async (req: Request, res: Response ) => {

    if(!req.user) {
        throw new AppError("Unauthorized", 401);
    }

    const date = typeof req.query.date === "string" ? req.query.date : undefined;

    const result = await getPlannerTask(req.user.userId,date);

    res.status(200).json(result);
});

export const updatePlannerTaskController = asyncHandler(async (req: Request, res: Response) => {

    if(!req.user) {
        throw new AppError("Unauthorized", 401);
    }

    const payload = updatePlannerTaskSchema.parse(req.body);

    const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;

    const result = await updatePlannerTask(taskId, req.user.userId, payload);

    res.status(200).json(result);
});

export const togglePlannerTaskController = asyncHandler(async (req: Request, res: Response) => {

    if(!req.user) {
        throw new AppError("Unauthorized", 401);
    }

    const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
    
    const result = await togglePlannnerTask(taskId, req.user.userId);

    res.status(200).json(result);
});

export const deletePlannerTaskController = asyncHandler(async (req: Request, res: Response) => {

    if(!req.user) {
        throw new AppError("Unauthorized", 401);
    }

    const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;

    const result = await deletePlannerTask(taskId, req.user.userId);

    res.status(200).json(result);
});

export const getPlannerCalendarController = asyncHandler(async(req: Request, res: Response) => {

    if(!req.user) {
        throw new AppError("Unauthorized", 401);
    }

    const result = await getPlannerCalendarDates(req.user.userId);

    res.status(200).json(result);
});