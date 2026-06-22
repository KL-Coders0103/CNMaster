import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

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

const app: Application = express();

app.use(helmet());

app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? [process.env.CLIENT_URL as string] 
    : "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const API_PREFIX = "/api/v1";
app.use(`${API_PREFIX}/auth`, authRoutes);
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

app.get("/health", (_req: Request, res: Response) => {
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