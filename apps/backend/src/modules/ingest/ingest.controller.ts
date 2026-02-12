import { Request, Response } from "express";
import { ingestSchema } from "./ingest.dto";
import z from "zod";
import { IngestService } from "./ingest.service";

export class IngestController {
    static async ingest(req: Request, res: Response) {
        const parsed = ingestSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: z.treeifyError(parsed.error)
            })
        }
        const { track } = await IngestService.ingest(parsed.data);
        return res.json({
            success: true,
            data: {
                trackId: track.id,
            }
        })
    }
}