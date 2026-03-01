export interface PlaybackHistoryCreate {
    trackId: string;
    playDuration: number;
}
export interface PlaybackHistory {
    id: number;
    userId: string;
    trackId: string;
    playDuration: number;
    playedAt: Date;
    createdAt: Date;
}