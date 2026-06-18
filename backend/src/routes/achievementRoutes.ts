import { Router } from "express";

import {
  authenticate,
} from "../middlewares/authMiddleware";

import {
  markAchievementViewedController,
} from "../controllers/achievementController";

const router = Router();

router.use(authenticate);

router.patch(
  "/:achievementId/viewed",
  markAchievementViewedController
);

export default router;