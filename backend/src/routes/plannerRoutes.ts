import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { createPlannerTaskController, deletePlannerTaskController, getPlannerCalendarController, getPlannerTasksController, togglePlannerTaskController, updatePlannerTaskController } from "../controllers/plannerController";

const router = Router();

router.use(authenticate);

router.post("/tasks", createPlannerTaskController);
router.get("/tasks", getPlannerTasksController);
router.patch("/tasks/:taskId", updatePlannerTaskController);
router.patch("/tasks/:taskId/toggle", togglePlannerTaskController);
router.delete("/tasks/:taskId", deletePlannerTaskController);
router.get("/calendar", getPlannerCalendarController);

export default router;