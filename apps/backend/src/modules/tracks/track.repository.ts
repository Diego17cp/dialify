import { DatabaseConnection } from "@/config";

export class TrackRepository {
    private db = DatabaseConnection.getInstance().getClient()
    async findById(id: string) {
        return this.db.track.findUnique({
            where: { id },
            include: {
                artists: {
                    include: {
                        artist: true,
                    }
                },
                genre: true,
            }
        })
    }
}