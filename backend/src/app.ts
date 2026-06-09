import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import healthRoutes from "./routes/healthRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import authRoutes from "./routes/authRoutes";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    errorMiddleware(err, req, res, next);
  }
);

export default app;