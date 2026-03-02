import { AuthRequest } from "@/app";
import { AppError } from "@/core";
import { Response } from "express";
import { TrackService } from "./track.service";

export class TrackController {
    static async getTrack(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const trackId = id as string;
        if (!trackId || typeof trackId !== "string") throw new AppError("Invalid track ID", 400);

        const track = await TrackService.getTrackById(trackId);

        res.json({
            success: true,
            data: {
                ...track,
                streamUrl: track.hlsPath
                    ? `${req.protocol}://${req.get("host")}${track.hlsPath}`
                    : null,
            },
        });
    }

    static async searchTracks(req: AuthRequest, res: Response) {
        const { q: query } = req.query;
        const searchQuery = query as string;
        if (!searchQuery || typeof searchQuery !== "string") throw new AppError("Invalid search query", 400);
        const page = parseInt((req.query.page as string) || "1", 10);
        const limit = parseInt((req.query.limit as string) || "20", 10);

        const tracks = await TrackService.searchTracks(searchQuery, page, limit);

        res.json({
            success: true,
            data: tracks.map(t => ({
                ...t,
                streamUrl: t.hlsPath ? `${req.protocol}://${req.get("host")}${t.hlsPath}` : null,
            })),
        })
    }

    static async checkStatus(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const trackId = id as string;
        if (!trackId || typeof trackId !== "string") throw new AppError("Invalid track ID", 400);

        const status = await TrackService.checkTrackStatus(trackId);

        res.json({
            success: true,
            data: status,
        });
    }
}