import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as quizController from "../controllers/quizController";

const router = Router();

router.use(authenticate);

router.get("/daily-challenge", quizController.getTodayChallengeController);
router.get("/adaptive", quizController.getAdaptiveQuizController);

router.post("/start", quizController.startQuizController);
router.post("/submit", quizController.submitQuizController);

router.get("/history", quizController.getQuizHistoryController);
router.get("/result/:attemptId", quizController.getQuizResultController);

export default router;