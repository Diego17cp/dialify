export interface PlaybackHistoryCreate {
    trackId: number;
    playDuration: number;
}
export interface PlaybackHistory {
    id: number;
    userId: number;
    trackId: number;
    playDuration: number;
    playedAt: Date;
    createdAt: Date;
}