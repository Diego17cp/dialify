import { AuthRequest } from "@/app";
import { Response } from "express";
import { RecommendationProfileService } from "./recommendationProfile.service";
import { AppError } from "@/core";

export class RecommendationProfileController {
    static async getProfile(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) throw new AppError("Unauthorized", 401);

        const profile = await RecommendationProfileService.getOrCreateProfile(userId);

        res.json({
            success: true,
            data: profile,
        });
    }

    static async recomputeProfile(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) throw new AppError("Unauthorized", 401);

        await RecommendationProfileService.recomputeProfile(userId);

        res.json({
            success: true,
            message: "Recommendation profile recomputed successfully",
        });
    }

    static async getRecommendations(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        if (!userId) throw new AppError("Unauthorized", 401);

        const limit = parseInt(req.query.limit as string) || 20;
        const exploreRate = parseFloat(req.query.exploreRate as string);

        const recommendations = await RecommendationProfileService.getRecommendations(
            userId,
            { limit, exploreRate }
        );

        res.json({
            success: true,
            data: recommendations,
        });
    }
}