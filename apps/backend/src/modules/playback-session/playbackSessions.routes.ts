import { Router } from "express";
import { PlaybackSessionController } from "./playbackSession.controller";
import { authGuard } from "@/app/middlewares";

const router: Router = Router();

router.post("/", authGuard, PlaybackSessionController.startSession);
router.post("/:sessionId/pause", authGuard, PlaybackSessionController.pauseSession);
router.post("/:sessionId/resume", authGuard, PlaybackSessionController.resumeSession);
router.post("/:sessionId/end", authGuard, PlaybackSessionController.endSession);
router.get("/current", authGuard, PlaybackSessionController.getCurrentSession);

export { router as playbackSessionRoutes };

