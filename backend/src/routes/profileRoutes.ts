import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { uploadAvatar } from "../middlewares/uploadMiddleware";
import * as profileController from "../controllers/profileController";

const router = Router();

router.use(authenticate);

router.get("/", profileController.getProfileController);
router.patch("/", profileController.updateProfileController);
router.delete("/", profileController.deleteProfileController);

router.get("/completion", profileController.getProfileCompletionController);
router.get("/achievements", profileController.getProfileAchievementsController);
router.get("/achievement-summary", profileController.getAchievementSummaryController);
router.get("/analytics", profileController.getProfileAnalyticsController);
router.get("/streak", profileController.getProfileStreakController);
router.get("/leaderboard", profileController.getLeaderboardController);
router.get("/activity-history", profileController.getActivityHistoryController);

router.get("/settings", profileController.getProfileSettingsController);
router.patch("/settings", profileController.updateProfileSettingsController);
router.patch("/change-password", profileController.changePasswordController);

router.post("/avatar", uploadAvatar.single("avatar"), profileController.uploadAvatarController);
router.delete("/avatar", profileController.removeAvatarController);

export default router;