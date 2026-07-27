import { Request, Response } from "express";
import * as adminUserService from "../services/adminUserService";
import { AppError } from "../utils/AppError";
import { z } from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["student", "teacher", "admin"]),
});

const toggleSuspensionSchema = z.object({
  isSuspended: z.boolean(),
});

const getStringParam = (param: any): string | undefined => {
  const value = Array.isArray(param) ? param[0] : param;
  if (typeof value !== "string") return undefined;
  return value;
};

const getRequiredId = (param: any): string => {
  const value = getStringParam(param);
  if (!value) throw new AppError("User ID is required", 400);
  return value;
};

const getNumericLimit = (param: any, defaultLimit: number, maxLimit: number): number => {
  const value = getStringParam(param) || String(defaultLimit);
  const parsed = parseInt(value, 10);
  return Math.min(isNaN(parsed) ? defaultLimit : parsed, maxLimit);
};

export const getUsersController = async (req: Request, res: Response) => {
  const page = getNumericLimit(req.query.page, 1, 10000); 
  const limit = getNumericLimit(req.query.limit, 20, 100); 
  
  const search = getStringParam(req.query.search);
  const year = getStringParam(req.query.year);
  const branch = getStringParam(req.query.branch);
  const section = getStringParam(req.query.section);

  const result = await adminUserService.getAllUsers({
    page, limit, search, year, branch, section
  });

  res.status(200).json(result);
};

export const toggleSuspensionController = async (req: Request, res: Response) => {
  const userId = getRequiredId(req.params.userId);
  const payload = toggleSuspensionSchema.parse(req.body);
  
  const result = await adminUserService.toggleSuspension(userId, payload.isSuspended);
  res.status(200).json(result);
};

export const updateRoleController = async (req: Request, res: Response) => {
  const userId = getRequiredId(req.params.userId);
  const payload = updateRoleSchema.parse(req.body);

  if (userId === req.user!.userId) {
    throw new AppError("You cannot change your own role.", 400);
  }

  const result = await adminUserService.updateUserRole(userId, payload.role);
  res.status(200).json(result);
};