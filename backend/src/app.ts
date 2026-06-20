import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorMiddleware } from "./middlewares/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes"; 
import plannerRoutes from "./routes/plannerRoutes";
import achievementRoutes from "./routes/achievementRoutes";
import profileRoutes from "./routes/profileRoutes";
import notesRoutes from "./routes/notesRoutes";

const app: Application = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/planner", plannerRoutes)
app.use("/api/achievements", achievementRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notes", notesRoutes);

// 404 Fallback Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

export default app;