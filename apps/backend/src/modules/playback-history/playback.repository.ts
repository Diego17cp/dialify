import { DatabaseConnection } from "@/config";
import { PlaybackHistory } from "./playback.types";

export class PlaybackRepository {
	private db = DatabaseConnection.getInstance().getClient();

	async create(data: {
		userId: string;
		trackId: number;
		playDuration: number;
        trackDuration: number;
        completionRate: number;
        wasSkipped: boolean;
        source?: string;
	}): Promise<PlaybackHistory> {
		return await this.db.playbackHistory.create({
			data: {
                userId: data.userId,
                trackId: data.trackId,
                playDuration: data.playDuration,
                trackDuration: data.trackDuration,
                completionRate: data.completionRate,
                wasSkipped: data.wasSkipped,
                source: data.source || null,
            },
		});
	}
    async findByUserId(userId: string, options: { limit?: number, offset?: number } = {}) {
        const { limit = 50, offset = 0 } = options;
        return await this.db.playbackHistory.findMany({
            where: { userId },
            include: {
                track: {
                    include: {
                        artists: {
                            include: { artist: true }
                        },
                        genre: true,
                    }
                }
            },
            orderBy: { playedAt: 'desc' },
            skip: offset,
            take: limit,
        })
    }
    async countByUserId(userId: string): Promise<number> {
        return await this.db.playbackHistory.count({ where: { userId } });
    }
    async getTrackWithDetails(trackId: number) {
        return await this.db.track.findUnique({
            where: { id: trackId },
            include: {
                artists: {
                    include: { artist: true }
                },
                genre: true,
            }
        })
    }
    async getMostPlayedTracks(userId: string, limit: number = 10) {
        const result = await this.db.playbackHistory.groupBy({
            by: ["trackId"],
            where: { userId },
            _count: { trackId: true },
            orderBy: { _count: { trackId: "desc" } },
            take: limit,
        });

        const trackIds = result.map((r) => r.trackId);
        const tracks = await this.db.track.findMany({
            where: { id: { in: trackIds } },
            include: {
                artists: { include: { artist: true } },
                genre: true,
            },
        });

        return result.map((r) => ({
            track: tracks.find((t) => t.id === r.trackId)!,
            playCount: r._count.trackId,
        }));
    }

    async getRecentlyPlayed(userId: string, limit: number = 20) {
        const plays = await this.db.playbackHistory.findMany({
            where: { userId },
            include: {
                track: {
                    include: {
                        artists: { include: { artist: true } },
                        genre: true,
                    },
                },
            },
            orderBy: { playedAt: "desc" },
            take: limit * 2,
        });

        const uniquePlays: typeof plays = [];
        const seenTracks = new Set<number>();

        for (const play of plays) {
            if (!seenTracks.has(play.trackId)) {
                uniquePlays.push(play);
                seenTracks.add(play.trackId);
            }
            if (uniquePlays.length >= limit) break;
        }

        return uniquePlays;
    }
}
