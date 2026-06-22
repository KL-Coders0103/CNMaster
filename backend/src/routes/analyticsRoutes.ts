import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as analyticsController from "../controllers/analyticsController";

const router = Router();

router.use(authenticate);

router.get("/weekly", analyticsController.getWeeklyAnalyticsController);
router.get("/learning", analyticsController.getLearningAnalyticsController);
router.get("/heatmap", analyticsController.getConsistencyHeatmapController);
router.get("/activities", analyticsController.getRecentActivitiesController);
router.get("/weak-areas", analyticsController.getWeakAreasController);

export default router;