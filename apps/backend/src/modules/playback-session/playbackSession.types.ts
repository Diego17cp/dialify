export type PlaybackSessionState = 
    | "PLAYING"
    | "PAUSED"
    | "ENDED"
    | "ERROR";

export interface StartPlaybackSession {
    trackId: number;
    queue?: number[];
}

export interface PlaybackSession {
    sessionId: string;
    userId: string;
    trackId: number;
    startTime: number;
    pausedAt?: number | undefined;
    totalPauseDuration: number;
    source: 'search' | 'playlist' | 'recommendation' | 'autoplay';
    searchQuery?: string;
    playlistId?: number;
    autoplayEnabled: boolean;
    queue: number[];
}