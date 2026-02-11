import { AppError } from "@/core";
import { MIN_PLAY_DURATION_SECONDS, SKIP_TRESHOLD } from "./playback.constants";
import { PlaybackRepository } from "./playback.repository";
import { RecommendationProfileService } from "../recommendation-profile";
import { SearchHistoryService } from "../search-history";

export class PlaybackService {
    private static repository = new PlaybackRepository();
    
    static async recordPlayback(data: {
        userId: string;
        trackId: number;
        playDuration: number;
        trackDuration: number;
        wasSkipped: boolean;
        source?: string;
        searchQuery?: string;
    }) {
        const { userId, trackId, playDuration, trackDuration, wasSkipped, source, searchQuery } = data;
        if (!userId || !trackId) throw new AppError("User ID and Track ID are required", 400);
        if (!trackDuration || trackDuration <= 0) throw new AppError("Track duration must be greater than zero", 400);
        if (playDuration < MIN_PLAY_DURATION_SECONDS){
            console.log(`Play duration (${playDuration}s) is less than minimum threshold, not recording playback.`);
            return null;
        }
        const completionRate = trackDuration > 0
            ? Math.min(playDuration / trackDuration, 1)
            : 0;
        const wasActuallySkipped = wasSkipped ?? completionRate < SKIP_TRESHOLD;
        const playback = await this.repository.create({
            userId,
            trackId,
            playDuration,
            trackDuration,
            completionRate,
            wasSkipped: wasActuallySkipped,
            ...(source && { source }),
        })
        const track = await this.repository.getTrackWithDetails(trackId);
        if (track) {
            const artistId = track.artists[0]?.artist.id;
            const genreName = track.genre?.name;
            RecommendationProfileService.updateProfileIncremental(userId, {
                type: "playback",
                trackId,
                ...(artistId && { artistId }),
                ...(genreName && { genreName }),
                completionRate,
                wasSkipped: wasActuallySkipped,
            }).catch(err => {
                console.error("Failed to update recommendation profile:", err);
            })
            if (source === "search" && searchQuery) {
                SearchHistoryService.markAsPlayed(userId, searchQuery).catch(err => {
                    console.error("Failed to mark search query as played:", err);
                });
            }
        }
        return playback;
    }
    static async getUserHistory(userId: string, options: {
        limit?: number;
        offset?: number;
    } = {}) {
        if (!userId) throw new AppError("User ID is required", 400);
        const history = await this.repository.findByUserId(userId, options);
        return history.map((play) => ({
            id: play.id,
            trackId: play.trackId,
            playedAt: play.playedAt,
            playDuration: play.playDuration,
            trackDuration: play.trackDuration,
            wasSkipped: play.wasSkipped,
            source: play.source,
            track: {
                id: play.track.id,
                title: play.track.title,
                duration: play.track.duration,
                thumbnailUrl: play.track.thumbnailUrl,
                artists: play.track.artists.map((a) => ({
                    id: a.artist.id,
                    name: a.artist.name,
                })),
                genre: play.track.genre?.name || null 
            }
        }))
    }
    static async getHistoryStats(userId: string) {
        if (!userId) {
            throw new AppError("User ID is required", 400);
        }

        const [totalPlays, mostPlayed, recentlyPlayed] = await Promise.all([
            this.repository.countByUserId(userId),
            this.repository.getMostPlayedTracks(userId, 10),
            this.repository.getRecentlyPlayed(userId, 20),
        ]);

        return {
            totalPlays,
            mostPlayed: mostPlayed.map((mp) => ({
                track: {
                    id: mp.track.id,
                    title: mp.track.title,
                    thumbnailUrl: mp.track.thumbnailUrl,
                    artists: mp.track.artists.map((a) => ({
                        id: a.artist.id,
                        name: a.artist.name,
                    })),
                },
                playCount: mp.playCount,
            })),
            recentlyPlayed: recentlyPlayed.map((play) => ({
                id: play.id,
                trackId: play.trackId,
                playedAt: play.playedAt,
                track: {
                    id: play.track.id,
                    title: play.track.title,
                    thumbnailUrl: play.track.thumbnailUrl,
                    artists: play.track.artists.map((a) => ({
                        id: a.artist.id,
                        name: a.artist.name,
                    })),
                },
            })),
        };
    }
}