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
    async findByQuery(query: string, limit: number = 20, offset: number = 0) {
        return this.db.track.findMany({
            where: {
                title: {
                    contains: query,
                    mode: "insensitive",
                }
            },
            include: {
                artists: {
                    include: {
                        artist: true,
                    }
                },
                genre: true,
            },
            take: limit,
            skip: offset,
        })
    }
}