import { Response } from "express";
import { PlaybackService } from "./playback.service";
import { AuthRequest } from "@/app";
import { AppError } from "@/core";

export class PlaybackController {
    static async recordPlayback(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError("Unauthorized", 401);
        }

        const { trackId, playDuration, trackDuration, wasSkipped, source, searchQuery } = req.body;

        if (!trackId || playDuration === undefined || !trackDuration) {
            throw new AppError(
                "trackId, playDuration, and trackDuration are required",
                400
            );
        }
        const playback = await PlaybackService.recordPlayback({
            userId,
            trackId: Number(trackId),
            playDuration: Number(playDuration),
            trackDuration: Number(trackDuration),
            wasSkipped: Boolean(wasSkipped),
            source,
            searchQuery,
        });
        if (!playback) {
            return res.json({
                success: true,
                message: "Play duration too short, not recorded",
            });
        }
        return res.status(201).json({
            success: true,
            data: playback,
        });
    }

    static async getUserHistory(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError("Unauthorized", 401);
        }

        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        const history = await PlaybackService.getUserHistory(userId, {
            limit,
            offset,
        });

        res.json({
            success: true,
            data: history,
            pagination: {
                limit,
                offset,
                total: history.length,
            },
        });
    }

    static async getHistoryStats(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError("Unauthorized", 401);
        }

        const stats = await PlaybackService.getHistoryStats(userId);

        res.json({
            success: true,
            data: stats,
        });
    }
}