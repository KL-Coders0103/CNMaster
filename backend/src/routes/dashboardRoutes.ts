import { Router } from "express";

import {
  authenticate,
} from "../middlewares/authMiddleware";

import {
  getHomeDashboardController,
} from "../controllers/dashboardController";

const router = Router();

router.get(
  "/home",
  authenticate,
  getHomeDashboardController
);

export default router;