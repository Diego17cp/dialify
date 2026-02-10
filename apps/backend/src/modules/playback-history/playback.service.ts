import { MIN_PLAY_DURATION_SECONDS } from "./playback.constants";
import { PlaybackRepository } from "./playback.repository";
import { PlaybackHistoryCreate } from "./playback.types";

export class PlaybackService {
    private repository = new PlaybackRepository();
    async registerPlayback(userId: string, payload: PlaybackHistoryCreate){
        const { trackId, playDuration } = payload;
        if (playDuration < MIN_PLAY_DURATION_SECONDS) return;
        const alreadyExists = await this.repository.existsToday(userId, trackId);
        if (alreadyExists) return;
        await this.repository.create({
            userId,
            trackId,
            playDuration
        });
    }
}