import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Unauthorized access", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Forbidden: You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

export const requireAdmin = requireRole(["admin"]);

export const requireTeacherOrAdmin = requireRole(["admin", "teacher"]);