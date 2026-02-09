import { AuthRequest } from "@/app";
import { AppError } from "@/core";
import { LikesService } from "./like.service";
import { Response } from "express";
import { LikeTargetType } from "generated/prisma/enums";

export class LikesController {
    static async toggleLike(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const { targetId, targetType } = req.body;

        if (!userId) throw new AppError("Unauthorized", 401);
        if (!targetId) throw new AppError("trackId is required", 400);
        if (!targetType) throw new AppError("targetType is required", 400);
        if (!["TRACK", "PLAYLIST", "ARTIST"].includes(targetType)) throw new AppError("Invalid targetType", 400);

        const result = await LikesService.toggleLike({
            userId,
            targetId,
            targetType
        });
        res.json({
            success: true,
            data: result
        })
    }
    static async toggleTrackLike(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const { trackId } = req.params;

        if (!userId) throw new AppError("Unauthorized", 401);

        const result = await LikesService.toggleTrackLike(
            userId,
            Number(trackId)
        );

        res.json({ success: true, data: result });
    }
    static async togglePlaylistLike(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const { playlistId } = req.params;

        if (!userId) throw new AppError("Unauthorized", 401);

        const result = await LikesService.togglePlaylistLike(
            userId,
            Number(playlistId)
        );

        res.json({ success: true, data: result });
    }
    static async toggleArtistLike(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const { artistId } = req.params;

        if (!userId) throw new AppError("Unauthorized", 401);

        const result = await LikesService.toggleArtistLike(
            userId,
            Number(artistId)
        );

        res.json({ success: true, data: result });
    }
    static async getUserLikesCollection(req: AuthRequest, res: Response) {
        const userId = req.user?.id;

        if (!userId) throw new AppError("Unauthorized", 401);

        const collection = await LikesService.getUserLikesCollection(userId);

        res.json({
            success: true,
            data: collection,
        });
    }
    static async checkIsLiked(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const { targetId, targetType } = req.query;

        if (!userId) throw new AppError("Unauthorized", 401);
        if (!targetId || !targetType) {
            throw new AppError("targetId and targetType are required", 400);
        }

        const isLiked = await LikesService.isLiked(
            userId,
            Number(targetId),
            targetType as LikeTargetType
        );

        res.json({
            success: true,
            data: { isLiked },
        });
    }
    static async getLikesStats(req: AuthRequest, res: Response) {
        const userId = req.user?.id;

        if (!userId) throw new AppError("Unauthorized", 401);

        const stats = await LikesService.getLikesStats(userId);

        res.json({
            success: true,
            data: stats,
        });
    }
}