import { AppError } from "@/core";
import { TrackRepository } from "./track.repository";
import { TrackStatus } from "generated/prisma/enums";

export class TrackService {
    private static repo = new TrackRepository();
    static async getTrackById(id: number) {
        const track = await this.repo.findById(id);
        if (!track) throw new AppError("Track not found", 404);
        return {
            id: track.id,
            title: track.title,
            duration: track.duration,
            thumbnailUrl: track.thumbnailUrl,
            source: track.source,
            sourceId: track.sourceId,
            status: track.status,
            hlsPath: track.hlsPath,
            bitrates: track.bitrates,
            artists: track.artists.map((a) => ({
                id: a.artist.id,
                name: a.artist.name,
            })),
            genre: track.genre?.name || null,
        };
    }
    static async checkTrackStatus(id: number) {
        const track = await this.repo.findById(id);
        if (!track) throw new AppError("Track not found", 404);
        return {
            trackId: track.id,
            status: track.status,
            isReady: track.status === TrackStatus.READY,
            hlsPath: track.hlsPath,
            progress: this.getStatusProgress(track.status),
        };
    }
    private static getStatusProgress(status: TrackStatus): number {
        switch (status) {
            case TrackStatus.PENDING:
                return 0;
            case TrackStatus.PROCESSING:
                return 50;
            case TrackStatus.READY:
                return 100;
            case TrackStatus.FAILED:
                return -1;
            default:
                return 0;
        }
    }
}