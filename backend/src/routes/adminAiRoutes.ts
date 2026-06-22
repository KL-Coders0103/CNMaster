import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { requireTeacherOrAdmin } from "../middlewares/roleMiddleware";
import * as adminGradingController from "../controllers/adminGradingController";

const router = Router();
router.use(authenticate, requireTeacherOrAdmin);

router.get("/grade-draft/:submissionId", adminGradingController.getSmartGradingDraftController);

export default router;