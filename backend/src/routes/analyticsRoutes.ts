import {
  Router,
} from "express";

import {
  authenticate,
} from "../middlewares/authMiddleware";

import {
  fetchWeeklyAnalytics,
  getConsistencyHeatmapController,
  getRecentActivitiesController,
} from "../controllers/analyticsController";
import { getLearningAnalyticsController } from "../controllers/learningAnalyticsController";

const router =
  Router();

router.get(
  "/weekly",
  authenticate,
  fetchWeeklyAnalytics
);

router.get(
  "/learning",
  authenticate,
  getLearningAnalyticsController
);

router.get(
  "/heatmap",
  authenticate,
  getConsistencyHeatmapController
);

router.get(
  "/activities",
  authenticate,
  getRecentActivitiesController
);

export default router;