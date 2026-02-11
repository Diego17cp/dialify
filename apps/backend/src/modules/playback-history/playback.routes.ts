import { Router } from "express";
import { PlaybackController } from "./playback.controller";
import { authGuard } from "@/app/middlewares";

const router: Router = Router();

router.post("/", authGuard, PlaybackController.recordPlayback);
router.get("/", authGuard, PlaybackController.getUserHistory);
router.get("/stats", authGuard, PlaybackController.getHistoryStats);

export { router as playbackHistoryRoutes };