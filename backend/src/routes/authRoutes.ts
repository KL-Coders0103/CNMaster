import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmailController);
router.post("/login", authController.loginController);
router.post("/refresh-token", authController.refreshAccessTokenController);
router.post("/logout", authController.logoutController);
router.post("/resend-otp", authController.resendOtpController);
router.post("/forgot-password", authController.forgotPasswordController);
router.post("/verify-forgot-password-otp", authController.verifyForgotPasswordOtpController);
router.post("/reset-password", authController.resetPasswordController);
router.post("/google", authController.googleLoginController);


router.post("/logout-all", authenticate, authController.logoutAllController);
router.patch("/complete-profile", authenticate, authController.completeProfileController);

export default router;