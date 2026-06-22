import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as searchController from "../controllers/searchController";

const router = Router();

router.use(authenticate);

router.get("/", searchController.globalSearchController);

export default router;