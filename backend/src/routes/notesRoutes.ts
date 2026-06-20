import { Router } from "express";

import { authenticate } from "../middlewares/authMiddleware";

import {
  bookmarkNoteController,
  getChaptersController,
  getNoteDetailsController,
  getNotesController,
  getSubjectsController,
  registerDownloadController,
  removeBookmarkController,
} from "../controllers/notesController";
import { getReadingProgressController, getRecentNotesController, saveReadingProgressController } from "../controllers/readingProgressController";

const router = Router();
router.use(authenticate);

router.get("/subjects", getSubjectsController);
router.get("/chapters/:subjectId", getChaptersController);
router.get("/", getNotesController);
router.get("/recent", getRecentNotesController);
router.post("/:noteId/progress", saveReadingProgressController);
router.get("/:noteId/progress", getReadingProgressController);
router.post("/:noteId/download", registerDownloadController);
router.get("/:noteId", getNoteDetailsController);
router.post("/:noteId/bookmark", bookmarkNoteController);
router.delete("/:noteId/bookmark", removeBookmarkController);

export default router;