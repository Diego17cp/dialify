import { DatabaseConnection } from "@/config";
import { CreatePlaylistDTO, UpdatePlaylistDTO } from "./playlist.types";

export class PlaylistRepository {
	private db = DatabaseConnection.getInstance().getClient();

	async findById(id: number) {
		return this.db.playlist.findUnique({
			where: { id },
			include: {
				tracks: {
					include: {
						track: true,
					},
				},
			},
		});
	}
    async countTracks (playlistId: number) {
        return this.db.playlistTrack.count({
            where: { playlistId }
        })
    }
    async trackExistsInPlaylist(playlistId: number, trackId: number) {
        return this.db.playlistTrack.findFirst({
            where: {
                playlistId,
                trackId
            }
        });
    }
    async getExistingTrackIds(playlistId: number, trackIds: number[]) {
        return this.db.playlistTrack.findMany({
            where: {
                playlistId,
                trackId: { in: trackIds },
            },
            select: {
                trackId: true
            }
        })
    }
    async addTrack(
        playlistId: number,
        trackId: number,
        position: number
    ) {
        return this.db.playlistTrack.create({
            data: {
                playlistId,
                trackId,
                orderIndex: position
            }
        })
    }
    async addTracks(playlistId: number, trackIds: number[]) {
        const existingCount = await this.countTracks(playlistId);
        const createData = trackIds.map((trackId, index) => ({
            playlistId,
            trackId,
            orderIndex: existingCount + index
        }));
        return this.db.playlistTrack.createMany({
            data: createData,
            skipDuplicates: true
        });
    }
    async removeTrack(playlistId: number, trackId: number) {
        return this.db.playlistTrack.deleteMany({
            where: {
                playlistId,
                trackId
            }
        })
    }
    async create(data: CreatePlaylistDTO) {
        return this.db.playlist.create({
            data: {
                name: data.name,
                description: data.description ?? null,
                ownerId: data.ownerId,
                isPublic: data.isPublic || false
            }
        })
    }
    async update(playlistId: number, data: UpdatePlaylistDTO) {
        return this.db.playlist.update({
            where: { id: playlistId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.isPublic !== undefined && { isPublic: data.isPublic })
            }
        })
    }
    async delete(playlistId: number) {
        return this.db.playlist.update({
            where: { id: playlistId },
            data: { isActive: false, deletedAt: new Date() }
        })
    }
    async listByOwnerId(ownerId: string) {
        return this.db.playlist.findMany({
            where: { ownerId },
            include: {
                _count: {
                    select: { tracks: true },
                },
                tracks: {
                    take: 1,
                    orderBy: { orderIndex: "asc" },
                    select: {
                        track: {
                            select: { thumbnailUrl: true },
                        },
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
        });
    }
    async getPlaylistTracks(
        playlistId: number,
        options: { skip: number; limit: number }
    ) {
        return this.db.playlistTrack.findMany({
            where: { playlistId },
            include: {
                track: {
                    include: {
                        artists: {
                            include: { artist: true },
                        },
                        genre: true,
                    },
                },
            },
            orderBy: { orderIndex: "asc" },
            skip: options.skip,
            take: options.limit,
        });
    }
}
