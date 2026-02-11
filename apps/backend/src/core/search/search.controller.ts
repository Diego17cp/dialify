import { AuthRequest } from "@/app";
import { Response } from "express";
import { searchQuerySchema } from "./search.dto";
import z from "zod";
import { SearchService } from "./search.service";

export class SearchController {
    static async search(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        const parsed = searchQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: z.treeifyError(parsed.error)
            })
        }
        const results = await SearchService.search(parsed.data.q, userId);
        return res.json({
            success: true,
            data: results
        })
    }
}