export interface PlaybackHistoryCreate {
    trackId: number;
    playDuration: number;
}
export interface PlaybackHistory {
    id: number;
    userId: string;
    trackId: number;
    playDuration: number;
    playedAt: Date;
    createdAt: Date;
}