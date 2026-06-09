import { Router } from "express";
import { loginController, logoutAllController, logoutController, refreshAccessTokenController, register, verifyEmailController } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.post("/refresh-token", refreshAccessTokenController);
router.post("/logout", logoutController);
router.post("/logout-all", authenticate, logoutAllController);

export default router;