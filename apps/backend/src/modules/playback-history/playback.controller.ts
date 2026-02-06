import { Response } from "express";
import { PlaybackService } from "./playback.service";
import { AuthRequest } from "@/app";

export class PlaybackController {
    private service = new PlaybackService();
    register = async (req: AuthRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { trackId, playDuration } = req.body;
        await this.service.registerPlayback(userId, { trackId, playDuration });
        return res.status(204).send();
    }
}