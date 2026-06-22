import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { requireTeacherOrAdmin } from "../middlewares/roleMiddleware";
import * as adminQuizController from "../controllers/adminQuizController";

const router = Router();
router.use(authenticate, requireTeacherOrAdmin);

router.post("/questions", adminQuizController.addQuestionController);
router.get("/chapters/:chapterId/questions", adminQuizController.getQuestionsController);

router.post("/assessments", adminQuizController.createQuizAssessmentController);
router.post("/generate", adminQuizController.generateAiQuizController);

export default router;