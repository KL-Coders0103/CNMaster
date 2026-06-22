import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as notifyController from "../controllers/notificationController";

const router = Router();
router.use(authenticate);

router.get("/", notifyController.getNotifications);
router.patch("/:id/read", notifyController.markAsRead);
router.patch("/read-all", notifyController.markAllAsRead);

export default router;