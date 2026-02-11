export interface ArtistStat {
    score: number;
    playCount: number;
    likeCount: number;
    searchCount: number;
    lastSeenAt: string;
    avgCompletionRate: number;
    skipRate: number;
}

export interface GenreStat {
    score: number;
    playCount: number;
    likeCount: number;
    lastSeenAt: string;
    avgCompletionRate: number;
}

export interface TrackStat {
    score: number;
    playCount: number;
    completionRate: number;
    skipCount: number;
    lastPlayedAt: string;
}

export interface SearchStat {
    frequency: number;
    lastSearchedAt: string;
    hasPlayed: boolean;
}

export type ArtistStatsMap = Record<string, ArtistStat>;
export type GenreStatsMap = Record<string, GenreStat>;
export type TrackStatsMap = Record<string, TrackStat>;
export type SearchStatsMap = Record<string, SearchStat>;

export interface RecommendationWeights {
    playback: number;
    like: number;
    search: number;
    completion: number;
    recency: number;
}