import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { getBookmarksController, toggleBookmarkController } from "../controllers/bookmarkController";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  getBookmarksController
);

router.post(
  "/:questionId",
  toggleBookmarkController
);

export default router;