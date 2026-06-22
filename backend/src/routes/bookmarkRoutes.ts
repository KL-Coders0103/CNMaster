import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as bookmarkController from "../controllers/bookmarkController";

const router = Router();

router.use(authenticate);

router.get("/", bookmarkController.getBookmarksController);
router.post("/:questionId", bookmarkController.toggleBookmarkController);

export default router;