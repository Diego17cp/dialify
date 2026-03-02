import { Router } from "express";
import { TrackController } from "./track.controller";

const router: Router = Router();

router.get("/:id", TrackController.getTrack);
router.get("/:id/status", TrackController.checkStatus);
router.get("/", TrackController.searchTracks);

export { router as trackRoutes };