import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as notesController from "../controllers/notesController";

const router = Router();

router.use(authenticate);

router.get("/chapters", notesController.getChaptersController);

router.get("/", notesController.getNotesController);
router.get("/recent", notesController.getRecentNotesController);
router.get("/:noteId", notesController.getNoteDetailsController);


router.post("/:noteId/download", notesController.registerDownloadController);
router.post("/:noteId/bookmark", notesController.bookmarkNoteController);
router.delete("/:noteId/bookmark", notesController.removeBookmarkController);

router.get("/:noteId/progress", notesController.getReadingProgressController);
router.post("/:noteId/progress", notesController.saveReadingProgressController);

export default router;