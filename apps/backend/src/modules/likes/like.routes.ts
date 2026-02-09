import { Router } from "express";
import { LikesController } from "./like.controller";

const router: Router = Router();

router.post("/toggle", LikesController.toggleLike);

router.post("/tracks/:trackId", LikesController.toggleTrackLike);
router.post("/playlists/:playlistId", LikesController.togglePlaylistLike);
router.post("/artists/:artistId", LikesController.toggleArtistLike);

router.get("/collection", LikesController.getUserLikesCollection);
router.get("/check", LikesController.checkIsLiked);
router.get("/stats", LikesController.getLikesStats);

export { router as likesRoutes };