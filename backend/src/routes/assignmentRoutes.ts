import { Router }
from "express";

import { authenticate }
from "../middlewares/authMiddleware";

import {
  getAssignmentsController,
  getAssignmentDetailsController,
  submitAssignmentController,
  getSubmissionHistoryController,
  getUpcomingAssignmentController,
  getAssignmentAnalyticsController,
} from "../controllers/assignmentController";

import {
  uploadAssignment
} from "../middlewares/uploadAssignmentMiddleware";

const router = Router();

router.use(authenticate);

router.get(
  "/history/me",
  getSubmissionHistoryController
);

router.get(
  "/upcoming/me",
  getUpcomingAssignmentController
);

router.get(
  "/analytics",
  getAssignmentAnalyticsController
);

router.get(
  "/",
  getAssignmentsController
);

router.get(
  "/:assignmentId",
  getAssignmentDetailsController
);

router.post(
  "/:assignmentId/submit",
  uploadAssignment.single("submission"),
  submitAssignmentController
);

export default router;