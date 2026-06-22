import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as studentAiController from "../controllers/studentAiController";
import * as revisionAiController from "../controllers/revisionAiController";

const router = Router();
router.use(authenticate);

router.post("/tutor/chat", studentAiController.askTutorController);
router.post("/tutor/eli5", studentAiController.eli5ExplainerController);
router.post("/planner/smart-sync", revisionAiController.generatePlannerTasksController);
router.get("/notes/:noteId/flashcards", revisionAiController.getFlashcardsController);

export default router;