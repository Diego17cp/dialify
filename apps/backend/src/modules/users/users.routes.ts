import { Router } from "express";
import { UsersController } from "./users.controller";
import { authGuard } from "@/app/middlewares";

const router: Router = Router();
const controller = new UsersController();

router.put("/profile", authGuard, controller.updateProfile);
router.get("/delete-account", authGuard, controller.deleteAccount);

export { router as usersRoutes };