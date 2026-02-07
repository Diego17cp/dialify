import { Request, Response } from "express";
import { searchQuerySchema } from "./search.dto";
import z from "zod";
import { SearchService } from "./search.service";

export class SearchController {
    static async search(req: Request, res: Response) {
        const parsed = searchQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: z.treeifyError(parsed.error)
            })
        }
        const results = await SearchService.search(parsed.data.q);
        return res.json({
            success: true,
            data: results
        })
    }
}