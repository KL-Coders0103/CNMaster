import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { requireTeacherOrAdmin } from "../middlewares/roleMiddleware";
import * as adminNotifyController from "../controllers/adminNotificationController";

const router = Router();
router.use(authenticate, requireTeacherOrAdmin);

router.post("/broadcast", adminNotifyController.broadcastNotificationController);

export default router;