import { Router } from "express";
import { completeProfileController, forgotPasswordController, googleLoginController, loginController, logoutAllController, logoutController, refreshAccessTokenController, register, resendOtpController, resetPasswordController, verifyEmailController, verifyForgotPasswordOtpController } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.post("/refresh-token", refreshAccessTokenController);
router.post("/logout", logoutController);
router.post("/logout-all", authenticate, logoutAllController);
router.post("/resend-otp", resendOtpController);
router.patch("/complete-profile", authenticate, completeProfileController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOtpController);
router.post("/reset-password", resetPasswordController);
router.post("/google", googleLoginController)

export default router;