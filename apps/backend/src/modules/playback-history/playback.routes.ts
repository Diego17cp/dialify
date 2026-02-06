import { Router } from "express";
import { PlaybackController } from "./playback.controller";
import { authGuard } from "@/app";

const router: Router = Router();
const controller = new PlaybackController();

router.post(
    "/register",
    authGuard,
    controller.register
)

export { router as playbackHistoryRoutes };