import { Router } from "express";
import { register, verifyEmailController } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmailController);

export default router;