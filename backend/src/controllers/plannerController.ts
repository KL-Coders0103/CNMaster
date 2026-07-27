import { Request, Response } from "express";
import * as plannerService from "../services/plannerService";
import { createPlannerTaskSchema, updatePlannerTaskSchema } from "../validations/plannerValidation";

export const createPlannerTaskController = async (req: Request, res: Response) => {
  const payload = createPlannerTaskSchema.parse(req.body);
  const result = await plannerService.createPlannerTask(req.user!.userId, payload);
  res.status(201).json(result);
};

export const getPlannerTasksController = async (req: Request, res: Response) => {
  const date = typeof req.query.date === "string" ? req.query.date : undefined;
  const result = await plannerService.getPlannerTasks(req.user!.userId, date);
  res.status(200).json(result);
};

export const updatePlannerTaskController = async (req: Request, res: Response) => {
  const payload = updatePlannerTaskSchema.parse(req.body);
  const taskId = req.params.taskId as string; 
  
  const result = await plannerService.updatePlannerTask(taskId, req.user!.userId, payload);
  res.status(200).json(result);
};

export const togglePlannerTaskController = async (req: Request, res: Response) => {
  const taskId = req.params.taskId as string; 
  const result = await plannerService.togglePlannerTask(taskId, req.user!.userId);
  res.status(200).json(result);
};

export const deletePlannerTaskController = async (req: Request, res: Response) => {
  const taskId = req.params.taskId as string; 
  const result = await plannerService.deletePlannerTask(taskId, req.user!.userId);
  res.status(200).json(result);
};

export const getPlannerCalendarController = async (req: Request, res: Response) => {
  const month = typeof req.query.month === "string" ? parseInt(req.query.month) : new Date().getMonth();
  const year = typeof req.query.year === "string" ? parseInt(req.query.year) : new Date().getFullYear();
  
  const result = await plannerService.getPlannerCalendarDates(req.user!.userId, month, year);
  res.status(200).json(result);
};