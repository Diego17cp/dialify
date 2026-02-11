import { AuthRequest } from "@/app";
import { Response } from "express";
import { SearchHistoryService } from "./searchHistory.service";
import { AppError } from "@/core";

export class SearchHistoryController {
    static async getSuggestions(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const query = req.query.q as string;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!userId) throw new AppError("Unauthorized", 401);
        if (!query) {
            return res.json({ success: true, data: [] });
        }

        const suggestions = await SearchHistoryService.getSuggestions(userId, query, limit);

        return res.json({ success: true, data: suggestions });
    }
}