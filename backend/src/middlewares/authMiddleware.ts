import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded =
      verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};