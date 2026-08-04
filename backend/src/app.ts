import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import Redis from "ioredis";
import compression from "compression";
import { errorMiddleware } from "./middlewares/errorMiddleware";

import authRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes"; 
import plannerRoutes from "./routes/plannerRoutes";
import achievementRoutes from "./routes/achievementRoutes";
import profileRoutes from "./routes/profileRoutes";
import notesRoutes from "./routes/notesRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import quizRoutes from "./routes/quizRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import searchRoutes from "./routes/searchRoutes";
import aiRoutes from "./routes/aiRoutes";

import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes";
import adminAssignmentRoutes from "./routes/adminAssignmentRoutes";
import adminContentRoutes from "./routes/adminContentRoutes";
import adminNotificationRoutes from "./routes/adminNotificationRoutes";
import adminQuizRoutes from "./routes/adminQuizRoutes";
import adminUserRoutes from "./routes/adminUserRoutes";
import adminAiRoutes from "./routes/adminAiRoutes";
export const redisClient = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

const app: Application = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

app.use(cors({
  origin(origin, callback) {
    const isNativeClient = !origin;
    const isAllowed =
      process.env.NODE_ENV !== "production" ||
      isNativeClient ||
      allowedOrigins.includes(origin);

    callback(isAllowed ? null : new Error("Origin is not allowed by CORS"), isAllowed);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: false,
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(args[0], ...args.slice(1)) as any,
  }),
  message: { success: false, message: "Too many requests, please try again later." },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "development" ? 10000 : 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(args[0], ...args.slice(1)) as any,
  }),
  validate: { 
    singleCount: false 
  },
  message: { 
    success: false, 
    message: "Too many authentication attempts. Account temporarily locked." 
  },
});

app.use("/api", globalLimiter);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authLimiter, authRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/planner`, plannerRoutes);
app.use(`${API_PREFIX}/achievements`, achievementRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);
app.use(`${API_PREFIX}/notes`, notesRoutes);
app.use(`${API_PREFIX}/assignments`, assignmentRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/quizzes`, quizRoutes);
app.use(`${API_PREFIX}/bookmarks`, bookmarkRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/search`, searchRoutes);
app.use(`${API_PREFIX}/ai`, aiRoutes);

const ADMIN_PREFIX = `${API_PREFIX}/admin`;

app.use(`${ADMIN_PREFIX}/analytics`, adminAnalyticsRoutes);
app.use(`${ADMIN_PREFIX}/assignments`, adminAssignmentRoutes);
app.use(`${ADMIN_PREFIX}/content`, adminContentRoutes);
app.use(`${ADMIN_PREFIX}/notifications`, adminNotificationRoutes);
app.use(`${ADMIN_PREFIX}/quizzes`, adminQuizRoutes);
app.use(`${ADMIN_PREFIX}/users`, adminUserRoutes);
app.use(`${ADMIN_PREFIX}/ai`, adminAiRoutes);

app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API Route not found",
  });
});

app.use(errorMiddleware);

export default app;