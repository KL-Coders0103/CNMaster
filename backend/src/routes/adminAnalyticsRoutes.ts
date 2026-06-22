import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { requireTeacherOrAdmin } from "../middlewares/roleMiddleware";
import * as adminAnalyticsController from "../controllers/adminAnalyticsController";

const router = Router();

router.use(authenticate, requireTeacherOrAdmin);

router.get("/dashboard", adminAnalyticsController.getDashboardStatsController);
router.get("/leaderboard", adminAnalyticsController.getAdminLeaderboardController);
router.get("/students/:userId", adminAnalyticsController.getIndividualStudentAnalyticsController);

export default router;