import { Router } from "express";
import { loginController, register, verifyEmailController } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmailController);
router.post("/login", loginController);

export default router;