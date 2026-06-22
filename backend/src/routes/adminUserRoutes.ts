import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";
import * as adminUserController from "../controllers/adminUserController";

const router = Router();


router.use(authenticate, requireAdmin);

router.get("/users", adminUserController.getUsersController);
router.patch("/users/:userId/suspend", adminUserController.toggleSuspensionController);
router.patch("/users/:userId/role", adminUserController.updateRoleController);

export default router;