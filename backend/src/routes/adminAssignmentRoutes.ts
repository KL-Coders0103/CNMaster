import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { requireTeacherOrAdmin } from "../middlewares/roleMiddleware";
import { uploadAssignment } from "../middlewares/uploadMiddleware";
import * as adminAssignmentController from "../controllers/adminAssignmentController";

const router = Router();

router.use(authenticate, requireTeacherOrAdmin);

router.post("/", uploadAssignment.single("file"), adminAssignmentController.createAssignmentController);
router.get("/:assignmentId/submissions", adminAssignmentController.getSubmissionsController);
router.patch("/submissions/:submissionId/grade", adminAssignmentController.gradeSubmissionController);

export default router;