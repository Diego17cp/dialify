import { DatabaseConnection } from "@/config";
import { PlaybackHistory } from "./playback.types";

export class PlaybackRepository {
	private db = DatabaseConnection.getInstance().getClient();

	async create(data: {
		userId: number;
		trackId: number;
		playDuration: number;
	}): Promise<PlaybackHistory> {
		return await this.db.playbackHistory.create({
			data,
		});
	}
    async existsToday(userId: number, trackId: number): Promise<boolean> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const count = await this.db.playbackHistory.count({
            where: {
                userId,
                trackId,
                playedAt: {
                    gte: today
                }
            }
        })
        return count > 0;
    }
}
