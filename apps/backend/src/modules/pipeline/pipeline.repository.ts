import { DatabaseConnection } from "@/config";
import { TrackStatus } from "generated/prisma/enums";

export class PipelineRepository {
    private db = DatabaseConnection.getInstance().getClient();

    async findById(trackId: number) {
        return this.db.track.findUnique({
            where: { id: trackId }
        })
    }
    async findBySourceId(sourceId: string){
        return this.db.track.findFirst({
            where: { sourceId, source: "youtube" }
        })
    }
    async updateStatus(trackId: number, status: TrackStatus) {
        return this.db.track.update({
            where: { id: trackId },
            data: { status }
        })
    }
    async markReady(
        trackId: number,
        data: {
            hlsPath: string;
            duration: number;
            bitrates: number[];
            fileSize: bigint;
        }
    ) {
        return this.db.track.update({
            where: { id: trackId },
            data: {
                status: TrackStatus.READY,
                hlsPath: data.hlsPath,
                duration: data.duration,
                bitrates: data.bitrates,
                fileSize: data.fileSize,
            },
        });
    }
    async markFailed(trackId: number) {
        return this.db.track.update({
            where: { id: trackId },
            data: { status: TrackStatus.FAILED }
        })
    }
    async isTrackReady(sourceId: string): Promise<boolean> {
        const track = await this.db.track.findFirst({
            where: {
                sourceId,
                source: "youtube",
                status: TrackStatus.READY,
            },
        });
        return !!track;
    }
    async getOldestReadyTracks(limit: number = 10) {
        return this.db.track.findMany({
            where: { status: TrackStatus.READY },
            orderBy: { updatedAt: "asc" },
            take: limit,
        });
    }
}