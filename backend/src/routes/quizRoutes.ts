import { Router }
from "express";

import {
  authenticate,
} from "../middlewares/authMiddleware";

import {
  getAdaptiveQuizController,
  getQuizHistoryController,
  getQuizResultController,
  getTodayChallengeController,
  startQuizController,
  submitQuizController,
} from "../controllers/quizController";

const router = Router();

router.use(authenticate);

router.post(
  "/start",
  startQuizController
);

router.post(
  "/submit",
  submitQuizController
);

router.get(
  "/history",
  getQuizHistoryController
);

router.get(
  "/result/:attemptId",
  getQuizResultController
);

router.get(
  "/daily-challenge",
  getTodayChallengeController
);

router.get(
  "/adaptive",
  getAdaptiveQuizController
);

export default router;