import { AuthRequest } from "@/app";
import { AppError } from "@/core";
import { Request, Response } from "express";
import { PlaybackSessionService } from "./playbackSession.service";

export class PlaybackSessionController {
    static async startSession(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) throw new AppError("Unauthorized", 401);

        const { trackId, source, searchQuery, playlistId, autoplayEnabled, queue } = req.body;

        if (!trackId) throw new AppError("trackId is required", 400);

        const session = await PlaybackSessionService.startSession({
            userId,
            trackId: Number(trackId),
            source: source || 'search',
            ...(searchQuery && { searchQuery }),
            ...(playlistId && { playlistId: Number(playlistId) }),
            autoplayEnabled: Boolean(autoplayEnabled),
            queue: queue || [],
        });

        res.status(201).json({ 
            success: true, 
            data: session,
            message: "Playback session started"
        });
    }
    static async pauseSession(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const { sessionId } = req.params;

        if (!userId) throw new AppError("Unauthorized", 401);

        const session = PlaybackSessionService.pauseSession(sessionId as string);

        res.json({ 
            success: true, 
            data: session,
            message: "Playback paused"
        });
    }
    static async resumeSession(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const { sessionId } = req.params;

        if (!userId) throw new AppError("Unauthorized", 401);

        const session = PlaybackSessionService.resumeSession(sessionId as string);

        res.json({ 
            success: true, 
            data: session,
            message: "Playback resumed"
        });
    }
    static async endSession(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const { sessionId } = req.params;

        if (!userId) throw new AppError("Unauthorized", 401);

        const nextSession = await PlaybackSessionService.endSession(sessionId as string);

        res.json({ 
            success: true, 
            data: { 
                ended: true,
                nextSession,
            },
            message: nextSession 
                ? "Session ended, autoplay started" 
                : "Session ended"
        });
    }
    static async getCurrentSession(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) throw new AppError("Unauthorized", 401);

        const session = PlaybackSessionService.getUserSession(userId);

        res.json({ 
            success: true, 
            data: session || null,
            message: session ? "Active session found" : "No active session"
        });
    }
    static async getStats(_: Request, res: Response) {
        const stats = PlaybackSessionService.getStats();
        res.json({ success: true, data: stats });
    }
}