import { AuthRequest } from "@/app";
import { Response } from "express";
import { PlaylistService } from "./playlist.service";
import { AppError } from "@/core";

export class PlaylistController {
    static async createPlaylist(req: AuthRequest, res: Response) {
        const { name, description, isPublic } = req.body;
        const ownerId = req.user?.id;

        if (!ownerId) throw new AppError("Authentication required", 401);
        if (!name || typeof name !== "string") throw new AppError("Valid playlist name is required", 400);

        const playlist = await PlaylistService.createPlaylist({
            name,
            description,
            ownerId,
            isPublic,
        });

        return res.status(201).json({
            success: true,
            data: playlist,
        });
    }
    static async updatePlaylist(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const playlistId = Number(id);
        const { name, description, isPublic } = req.body;

        if (isNaN(playlistId)) {
            throw new AppError("Invalid playlist ID", 400);
        }

        const updatedPlaylist = await PlaylistService.updatePlaylist(playlistId, {
            name,
            description,
            isPublic,
        });

        return res.json({
            success: true,
            data: updatedPlaylist,
        });
    }
    static async deletePlaylist(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const playlistId = Number(id);

        if (isNaN(playlistId)) throw new AppError("Invalid playlist ID", 400);

        await PlaylistService.deletePlaylist(playlistId);

        return res.json({
            success: true,
            message: "Playlist deleted successfully",
        });
    }

    static async getPlaylistsByOwner(req: AuthRequest, res: Response) {
        const { ownerId: id } = req.params;
        const ownerId = id as string || req.user?.id;
        const currentUserId = req.user?.id;

        if (!ownerId) throw new AppError("Owner ID is required", 400);

        const playlists = await PlaylistService.getPlaylistByOwnerId(ownerId, currentUserId);

        return res.json({
            success: true,
            data: playlists,
        });
    }

    static async getPlaylistDetails(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const playlistId = Number(id);
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const userId = req.user?.id;

        if (isNaN(playlistId)) throw new AppError("Invalid playlist ID", 400);

        const playlist = await PlaylistService.getPlaylistDetails(playlistId, {
            page,
            limit,
            ...(userId && { userId }),
        });

        return res.json({
            success: true,
            data: playlist,
        });
    }

    static async addTracks(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const playlistId = Number(id);
        const { tracks } = req.body;

        if (isNaN(playlistId)) throw new AppError("Invalid playlist ID", 400);
        if (!Array.isArray(tracks) || tracks.length === 0) throw new AppError("Tracks array is required and must not be empty", 400);

        const result = await PlaylistService.addTracks({
            playlistId,
            tracks,
        });

        return res.json({
            success: true,
            data: result,
        });
    }

    static async removeTrack(req: AuthRequest, res: Response) {
        const { playlistId: playlistIdParam, trackId: trackIdParam } = req.params;
        const playlistId = Number(playlistIdParam);
        const trackId = Number(trackIdParam);

        if (isNaN(playlistId) || isNaN(trackId)) throw new AppError("Invalid playlist or track ID", 400);

        await PlaylistService.removeTrack(playlistId, trackId);

        return res.json({
            success: true,
            message: "Track removed from playlist",
        });
    }
}