import { Router } from "express";
import { loginController, refreshAccessTokenController, register, verifyEmailController } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.post("/refresh-token", refreshAccessTokenController);

export default router;