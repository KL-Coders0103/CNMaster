import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import * as plannerController from "../controllers/plannerController";

const router = Router();

router.use(authenticate);

router.post("/tasks", plannerController.createPlannerTaskController);
router.get("/tasks", plannerController.getPlannerTasksController);
router.patch("/tasks/:taskId", plannerController.updatePlannerTaskController);
router.patch("/tasks/:taskId/toggle", plannerController.togglePlannerTaskController);
router.delete("/tasks/:taskId", plannerController.deletePlannerTaskController);

router.get("/calendar", plannerController.getPlannerCalendarController);

export default router;