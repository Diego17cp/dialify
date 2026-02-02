import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authGuard } from "@/app/middlewares";

const router: Router = Router();
const controller = new AuthController();

router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/anonymous", controller.loginAnonymous);
router.get("/refresh", controller.refresh);
router.post("/forgot-password", controller.requestPasswordReset);
router.post("/reset-password", controller.resetPassword);

router.post("/logout", authGuard, controller.logout);
router.get("/me", authGuard, controller.me);
router.post("/convert", authGuard, controller.convertAnonymous);

export { router as authRoutes };