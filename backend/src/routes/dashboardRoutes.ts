import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as dashboardController from "../controllers/dashboardController";

const router = Router();

router.get("/home", authenticate, dashboardController.getHomeDashboardController);

export default router;