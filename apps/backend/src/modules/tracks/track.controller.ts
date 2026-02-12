import { AuthRequest } from "@/app";
import { AppError } from "@/core";
import { Response } from "express";
import { TrackService } from "./track.service";

export class TrackController {
    static async getTrack(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const trackId = parseInt(id as string);
        if (isNaN(trackId)) throw new AppError("Invalid track ID", 400);

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

    static async checkStatus(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const trackId = parseInt(id as string);
        if (isNaN(trackId)) throw new AppError("Invalid track ID", 400);

        const status = await TrackService.checkTrackStatus(trackId);

        res.json({
            success: true,
            data: status,
        });
    }
}