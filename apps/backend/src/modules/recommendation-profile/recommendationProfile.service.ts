import { AppError } from "@/core";
import { RecommendationProfileRepository } from "./recommendationProfile.repository";
import { ArtistStatsMap, GenreStatsMap, RecommendationWeights, SearchStatsMap, TrackStatsMap } from "./recommendationProfile.types";

export class RecommendationProfileService {
    private static repo = new RecommendationProfileRepository();

    private static readonly WEIGHTS: RecommendationWeights = {
        playback: 1.0,
        like: 5.0,
        search: 2.0,
        completion: 3.0,
        recency: 1.5,
    }
    private static readonly DECAY_DAYS = 30;
    private static readonly SKIP_THRESHOLD = 0.3;

    static async getOrCreateProfile(userId: string) {
        if (!userId) throw new AppError("User ID is required", 400);
        const existing = await this.repo.findByUserId(userId);
        if (existing) return existing;
        return this.repo.create(userId);
    }
    static async getProfile(userId: string) {
        if (!userId) throw new AppError("User ID is required", 400);
        const profile = await this.repo.findByUserId(userId);
        if (!profile) throw new AppError("Recommendation profile not found", 404);
        return profile;
    }
    private static calculateDecay(date: Date) {
        const daySice = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
        return Math.exp(-daySice / this.DECAY_DAYS);
    }
    private static calculateScore(
        base: number,
        date: Date,
        multiplier: number = 1, 
    ): number {
        const decay = this.calculateDecay(date);
        return base * decay * multiplier;
    }
    static async recomputeProfile(userId: string) {
        await this.getOrCreateProfile(userId);
        const artistStats: ArtistStatsMap = {};
        const genreStats: GenreStatsMap = {};
        const trackStats: TrackStatsMap = {};
        const searchStats: SearchStatsMap = {};


        const plays = await this.repo.findPlaybackSignals(userId);
        for (const play of plays) {
            const trackId = String(play.track.id);
            const artistId = String(play.track.artists[0]?.artist.id);
            const genreName = play.track.genre?.name;

            const completionRate = play.trackDuration > 0
                ? Math.min(play.playDuration / play.trackDuration, 1)
                : 0;
            const wasSkipped = completionRate < this.SKIP_THRESHOLD;
            const completionBonus = wasSkipped
                ? -0.5
                : completionRate * this.WEIGHTS.completion;
            const baseScore = this.calculateScore(
                this.WEIGHTS.playback + completionBonus,
                play.playedAt,
            )
            trackStats[trackId] ??= {
                score: 0,
                playCount: 0,
                completionRate: 0,
                skipCount: 0,
                lastPlayedAt: play.playedAt.toISOString(),
            };
            trackStats[trackId].score += baseScore;
            trackStats[trackId].playCount += 1;
            trackStats[trackId].completionRate =
                (trackStats[trackId].completionRate * (trackStats[trackId].playCount - 1) + completionRate) / trackStats[trackId].playCount;
            if (wasSkipped) trackStats[trackId].skipCount += 1;
            if (artistId) {
                artistStats[artistId] ??= {
                    score: 0,
                    playCount: 0,
                    likeCount: 0,
                    searchCount: 0,
                    lastSeenAt: play.playedAt.toISOString(),
                    avgCompletionRate: 0,
                    skipRate: 0,
                }
                artistStats[artistId].score += baseScore;
                artistStats[artistId].playCount += 1;
                artistStats[artistId].avgCompletionRate =
                    (artistStats[artistId].avgCompletionRate * (artistStats[artistId].playCount - 1) + completionRate) / artistStats[artistId].playCount;
                if (new Date(artistStats[artistId].lastSeenAt) < play.playedAt) {
                    artistStats[artistId].lastSeenAt = play.playedAt.toISOString();
                }
            }
            if (genreName) {
                genreStats[genreName] ??= {
                    score: 0,
                    playCount: 0,
                    likeCount: 0,
                    lastSeenAt: play.playedAt.toISOString(),
                    avgCompletionRate: 0,
                }
                genreStats[genreName].score += baseScore;
                genreStats[genreName].playCount += 1;
                genreStats[genreName].avgCompletionRate =
                    (genreStats[genreName].avgCompletionRate * (genreStats[genreName].playCount - 1) + completionRate) / genreStats[genreName].playCount;
                if (new Date(genreStats[genreName].lastSeenAt) < play.playedAt) {
                    genreStats[genreName].lastSeenAt = play.playedAt.toISOString();
                }
            }
        }
        const likes = await this.repo.findLikeSignals(userId);
        for (const like of likes) {
            if (!like.track || !like.isActive) continue;
            const artistId = String(like.track.artists[0]?.artist.id);
            const genreName = like.track.genre?.name;
            const likeScore = this.calculateScore(
                this.WEIGHTS.like,
                like.createdAt
            )
            if (artistId && artistStats[artistId]) {
                artistStats[artistId].score += likeScore;
                artistStats[artistId].likeCount += 1;
            }
            if (genreName && genreStats[genreName]) {
                genreStats[genreName].score += likeScore;
                genreStats[genreName].likeCount += 1;
            }
        }
        const searches = await this.repo.findSearchSignals(userId);
        for (const search of searches) {
            const query = search.query.toLowerCase();
            searchStats[query] ??= {
                frequency: 0,
                lastSearchedAt: search.lastSearchedAt.toISOString(),
                hasPlayed: search.hasPlayed,
            }
            searchStats[query].frequency += search.searchCount;
            searchStats[query].hasPlayed = searchStats[query].hasPlayed || search.hasPlayed;
            Object.keys(artistStats).forEach(artistId => {
                if (searchStats[query]?.hasPlayed) {
                    const searchScore = this.calculateScore(
                        this.WEIGHTS.search * search.searchCount,
                        search.lastSearchedAt,
                    )
                    if (artistStats[artistId]) {
                        artistStats[artistId].searchCount += search.searchCount;
                        artistStats[artistId].score += searchScore * 0.5;
                    }
                };
            });
        }
        Object.keys(artistStats).forEach(artistId => {
            const stat = artistStats[artistId];
            if (stat) {
                stat.skipRate = stat.playCount > 0
                    ? (1 - stat.avgCompletionRate)
                    : 0;
            }
        })
        const normalizetats = (stats: Record<string, { score: number }>) => {
            const maxScore = Math.max(...Object.values(stats).map(s => s.score), 1);
            Object.keys(stats).forEach(key => {
                if (stats[key]) {
                    stats[key].score = stats[key].score / maxScore * 100;
                }
            });
        }
        normalizetats(artistStats);
        normalizetats(genreStats);
        normalizetats(trackStats);

        const diversityScore = this.calculateDiversity(artistStats);
        await this.repo.update(userId, artistStats, genreStats, trackStats, searchStats, diversityScore);
    }
    private static calculateDiversity(artistStats: ArtistStatsMap): number {
        const scores = Object.values(artistStats).map(s => s.score);
        if (scores.length === 0) return 0.5;
        const total = scores.reduce((a, b) => a + b, 0);
        if (total === 0) return 0.5;
        const probabiliities = scores.map(s => s / total);
        const entropy = -probabiliities.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0);
        const maxEntropy = Math.log2(scores.length);
        return maxEntropy > 0 ? entropy / maxEntropy : 0.5;
    }
    static async updateProfileIncremental(
        userId: string,
        signal: {
            type: 'playback' | 'like' | 'search',
            trackId?: number;
            artistId?: number;
            genreName?: string;
            query?: string;
            completionRate?: number;
            wasSkipped?: boolean;
        }
    ) {
        const profile = await this.getOrCreateProfile(userId);
        const artistStats = (profile.artistStats || {}) as unknown as ArtistStatsMap;
        const genreStats = (profile.genreStats || {}) as unknown as GenreStatsMap;
        const trackStats = (profile.trackStats || {}) as unknown as TrackStatsMap;
        const searchStats = (profile.searchStats || {}) as unknown as SearchStatsMap;

        const now = new Date();

        if (signal.type === 'playback' && signal.trackId) {
            const trackId = String(signal.trackId);
            const completionRate = signal.completionRate ?? 0;
            const wasSkipped = signal.wasSkipped ?? completionRate < this.SKIP_THRESHOLD;
            const completionBonus = wasSkipped
                ? -0.5
                : completionRate * this.WEIGHTS.completion;
            const baseScore = this.WEIGHTS.playback + completionBonus;
            trackStats[trackId] ??= {
                score: 0,
                playCount: 0,
                completionRate: 0,
                skipCount: 0,
                lastPlayedAt: now.toISOString(),
            };
            trackStats[trackId].score += baseScore;
            trackStats[trackId].playCount += 1;
            trackStats[trackId].completionRate = 
                (trackStats[trackId].completionRate * (trackStats[trackId].playCount - 1) + completionRate) / 
                trackStats[trackId].playCount;
            if (wasSkipped) trackStats[trackId].skipCount += 1;
            if (signal.artistId) {
                const artistId = String(signal.artistId);
                artistStats[artistId] ??= {
                    score: 0,
                    playCount: 0,
                    likeCount: 0,
                    searchCount: 0,
                    lastSeenAt: now.toISOString(),
                    avgCompletionRate: 0,
                    skipRate: 0,
                };
                artistStats[artistId].score += baseScore;
                artistStats[artistId].playCount += 1;
                artistStats[artistId].avgCompletionRate = 
                    (artistStats[artistId].avgCompletionRate * (artistStats[artistId].playCount - 1) + completionRate) / 
                    artistStats[artistId].playCount;
                artistStats[artistId].lastSeenAt = now.toISOString();
            }
            if (signal.genreName) {
                genreStats[signal.genreName] ??= {
                    score: 0,
                    playCount: 0,
                    likeCount: 0,
                    lastSeenAt: now.toISOString(),
                    avgCompletionRate: 0,
                };
                const genreStat = genreStats[signal.genreName];
                if (genreStat) {
                    genreStat.score += baseScore;
                    genreStat.playCount += 1;
                    genreStat.avgCompletionRate = 
                        (genreStat.avgCompletionRate * (genreStat.playCount - 1) + completionRate) / 
                        genreStat.playCount;
                    genreStat.lastSeenAt = now.toISOString();
                }
            }
        }
        if (signal.type === 'like' && signal.artistId) {
            const artistId = String(signal.artistId);
            if (artistStats[artistId]) {
                artistStats[artistId].score += this.WEIGHTS.like;
                artistStats[artistId].likeCount += 1;
            }

            if (signal.genreName) {
                const genreStat = genreStats[signal.genreName];
                if (genreStat) {
                    genreStat.score += this.WEIGHTS.like;
                    genreStat.likeCount += 1;
                }
            }
        }
        if (signal.type === 'search' && signal.query) {
            const query = signal.query.toLowerCase();
            searchStats[query] ??= {
                frequency: 0,
                lastSearchedAt: now.toISOString(),
                hasPlayed: false,
            };
            searchStats[query].frequency += 1;
            searchStats[query].lastSearchedAt = now.toISOString();
        }

        const diversityScore = this.calculateDiversity(artistStats);
        await this.repo.update(userId, artistStats, genreStats, trackStats, searchStats, diversityScore);
    }
    static async getRecommendations(
        userId: string,
        options: {
            limit?: number;
            excludeTrackIds?: number[];
            exploreRate?: number
        } = {}
    ) {
        const { limit = 20, excludeTrackIds = [], exploreRate } = options;
        const profile = await this.getProfile(userId);
        const artistStats = profile.artistStats as unknown as ArtistStatsMap;
        const genreStats = profile.genreStats as unknown as GenreStatsMap;

        const effectiveExploreRate = exploreRate ?? profile.diversityScore;
        const topArtists = Object.entries(artistStats)
            .filter(([_, stat]) => stat.skipRate < 0.5)
            .sort((a, b) => b[1].score - a[1].score)
            .slice(0, 5)
            .map(([id]) => parseInt(id));
        const topGenres = Object.entries(genreStats)
            .sort((a, b) => b[1].score - a[1].score)
            .slice(0, 5)
            .map(([name]) => name);
        const recommendations = await this.repo.findRecommendedTracks({
            artistIds: topArtists,
            genres: topGenres,
            excludeTrackIds,
            limit,
            exploreRate: effectiveExploreRate,
        })
        return recommendations;
    }
}