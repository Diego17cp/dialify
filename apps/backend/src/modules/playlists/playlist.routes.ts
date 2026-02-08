import { Router } from "express";
import { PlaylistController } from "./playlist.controller";

const router: Router = Router();

router.post("/", PlaylistController.createPlaylist);
router.put("/:id", PlaylistController.updatePlaylist);
router.patch("/:id", PlaylistController.deletePlaylist);
router.get("/owner/:ownerId", PlaylistController.getPlaylistsByOwner);
router.get("/:id", PlaylistController.getPlaylistDetails);
router.post("/:id/tracks", PlaylistController.addTracks);
router.delete("/:playlistId/tracks/:trackId", PlaylistController.removeTrack);

export { router as playlistRoutes };