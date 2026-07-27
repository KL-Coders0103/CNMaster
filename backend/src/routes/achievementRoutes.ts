import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as achievementController from "../controllers/achievementController";

const router = Router();

router.use(authenticate);

router.patch("/:userAchievementId/viewed", achievementController.markAchievementViewedController);

export default router;