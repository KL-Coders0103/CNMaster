import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as adminUserService from "../services/adminUserService";
import { z } from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["student", "teacher", "admin"]),
});

const toggleSuspensionSchema = z.object({
  isSuspended: z.boolean(),
});

export const getUsersController = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string | undefined;
  const year = req.query.year as string | undefined;
  const branch = req.query.branch as string | undefined;
  const section = req.query.section as string | undefined;

  const result = await adminUserService.getAllUsers({
    page, limit, search, year, branch, section
  });

  res.status(200).json(result);
});

export const toggleSuspensionController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const payload = toggleSuspensionSchema.parse(req.body);
  
  const result = await adminUserService.toggleSuspension(userId, payload.isSuspended);
  res.status(200).json(result);
});

export const updateRoleController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const payload = updateRoleSchema.parse(req.body);

  if (userId === req.user!.userId) {
    res.status(400).json({ success: false, message: "You cannot change your own role." });
    return;
  }

  const result = await adminUserService.updateUserRole(userId, payload.role);
  res.status(200).json(result);
});