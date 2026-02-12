import { Router } from "express";
import {
    authRoutes,
    ingestRoutes,
    likesRoutes,
    playbackHistoryRoutes,
    playbackSessionRoutes,
    playlistRoutes,
    recommendationProfileRoutes,
    trackRoutes,
    usersRoutes
} from "@/modules";
import { authGuard, registeredUserGuard } from "./middlewares";
import { searchRoutes } from "@/core/search";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/search", authGuard, searchRoutes);
router.use("/tracks/ingest", authGuard, ingestRoutes);
router.use("/tracks", authGuard, trackRoutes);
router.use("/playlists", authGuard, playlistRoutes);
router.use("/likes", registeredUserGuard, likesRoutes);
router.use("/history", playbackHistoryRoutes);
router.use("/recommendations", authGuard, recommendationProfileRoutes)
router.use("/playback", authGuard, playbackSessionRoutes);


router.use("/", (_, res) => {
    res.json({ message: "Welcome to Dialify Backend API" });
})

export default router;