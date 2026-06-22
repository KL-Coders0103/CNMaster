import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { requireTeacherOrAdmin } from "../middlewares/roleMiddleware";
import { uploadNote } from "../middlewares/uploadMiddleware";
import * as adminContentController from "../controllers/adminContentController";

const router = Router();

router.use(authenticate, requireTeacherOrAdmin);

router.post("/notes", uploadNote.single("file"), adminContentController.uploadNoteController);

export default router;