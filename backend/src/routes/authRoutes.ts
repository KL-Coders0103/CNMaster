import { Router } from "express";
import { loginController, logoutController, refreshAccessTokenController, register, verifyEmailController } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.post("/refresh-token", refreshAccessTokenController);
router.post("/logout", logoutController);

export default router;