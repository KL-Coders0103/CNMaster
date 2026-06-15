import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { 
  completeProfileController, 
  forgotPasswordController, 
  googleLoginController, 
  loginController, 
  logoutAllController, 
  logoutController, 
  refreshAccessTokenController, 
  register, 
  resendOtpController, 
  resetPasswordController, 
  verifyEmailController, 
  verifyForgotPasswordOtpController 
} from "../controllers/authController";

const router = Router();

// Public Routes
router.post("/register", register);
router.post("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.post("/refresh-token", refreshAccessTokenController);
router.post("/logout", logoutController);
router.post("/resend-otp", resendOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOtpController);
router.post("/reset-password", resetPasswordController);
router.post("/google", googleLoginController);

// Protected Routes
router.post("/logout-all", authenticate, logoutAllController);
router.patch("/complete-profile", authenticate, completeProfileController);

export default router;