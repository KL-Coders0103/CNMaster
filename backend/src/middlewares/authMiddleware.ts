import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";
import { redisClient } from "../app";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const isBlacklisted = await redisClient.get(`blacklist:${decoded.userId}`);
    
    if (isBlacklisted) {
      res.status(401).json({ 
        success: false, 
        message: "Session revoked or account suspended. Please log in again." 
      });
      return;
    }

    req.user = { 
      userId: decoded.userId, 
      role: decoded.role 
    };

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};