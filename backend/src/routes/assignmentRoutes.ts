import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as assignmentController from "../controllers/assignmentController";
import { uploadAssignment } from "../middlewares/uploadMiddleware";


const router = Router();

router.use(authenticate);

router.get("/history/me", assignmentController.getSubmissionHistoryController);
router.get("/upcoming/me", assignmentController.getUpcomingAssignmentController);
router.get("/analytics", assignmentController.getAssignmentAnalyticsController);

router.get("/", assignmentController.getAssignmentsController);
router.get("/:assignmentId", assignmentController.getAssignmentDetailsController);

router.post(
  "/:assignmentId/submit",
  uploadAssignment.single("submission"),
  assignmentController.submitAssignmentController
);

export default router;