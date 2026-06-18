import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { changePasswordController, deleteProfileController, getAchievementSummaryController, getActivityHistoryController, getLeaderboardController, getProfileAchievementsController, getProfileAnalyticsController, getProfileCompletionController, getProfileController, getProfileSettingsController, getProfileStreakController, removeAvatarController, updateProfileController, updateProfileSettingsController, uploadAvatarController } from "../controllers/profileController";
import { uploadAvatar } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/", authenticate, getProfileController);
router.patch("/",authenticate,updateProfileController);
router.get("/achievements", authenticate, getProfileAchievementsController);
router.get("/analytics", authenticate, getProfileAnalyticsController);
router.get("/streak", authenticate, getProfileStreakController);
router.get("/leaderboard", authenticate, getLeaderboardController);
router.get("/activity-history", authenticate, getActivityHistoryController);
router.get("/achievement-summary", authenticate, getAchievementSummaryController);
router.delete("/", authenticate, deleteProfileController);
router.get("/settings", authenticate, getProfileSettingsController);
router.patch("/settings", authenticate, updateProfileSettingsController);
router.post("/avatar", authenticate, uploadAvatar.single("avatar"), uploadAvatarController);
router.patch("/change-password", authenticate, changePasswordController);
router.delete("/avatar", authenticate, removeAvatarController);
router.get("/completion", authenticate, getProfileCompletionController);

export default router;