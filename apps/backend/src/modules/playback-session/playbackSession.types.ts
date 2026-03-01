export type PlaybackSessionState = 
    | "PLAYING"
    | "PAUSED"
    | "ENDED"
    | "ERROR";

export interface StartPlaybackSession {
    trackId: string;
    queue?: string[];
}

export interface PlaybackSession {
    sessionId: string;
    userId: string;
    trackId: string;
    startTime: number;
    pausedAt?: number | undefined;
    totalPauseDuration: number;
    source: 'search' | 'playlist' | 'recommendation' | 'autoplay';
    searchQuery?: string;
    playlistId?: string;
    autoplayEnabled: boolean;
    queue: string[];
}