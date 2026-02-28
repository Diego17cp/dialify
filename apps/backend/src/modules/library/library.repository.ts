import { DatabaseConnection } from "@/config";

export class LibraryRepository {
    private db = DatabaseConnection.getInstance().getClient();
    async getLikesPlaylist(userId: string) {
        return this.db.playlist.findFirst({
            where: {
                ownerId: userId,
                isLikesPlaylist: true,
            },
            select: {
                id: true,
                name: true,
                description: true,
                isPublic: true,
                ownerId: true,
                _count: { select: { tracks: true } },
                tracks: {
                    take: 1,
                    select: { track: { select: { thumbnailUrl: true } } }
                }
            }
        });
    }
    async getLikedPlaylists(userId: string) {
        return this.db.like.findMany({
            where: { userId, targetType: "PLAYLIST", isActive: true },
            orderBy: { createdAt: "desc" },
            select: {
                createdAt: true,
                playlist: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        isPublic: true,
                        isLikesPlaylist: true,
                        ownerId: true,
                        _count: { select: { tracks: true } },
                        tracks: {
                            take: 1,
                            select: { track: { select: { thumbnailUrl: true } } }
                        }
                    }
                }
            }
        });
    }
    async getLikedArtists(userId: string) {
        return this.db.like.findMany({
            where: { userId, targetType: "ARTIST", isActive: true },
            orderBy: { createdAt: "desc" },
            select: {
                createdAt: true,
                artist: {
                    select: {
                        id: true,
                        name: true,
                        source: true,
                        imageUrl: true
                    }
                }
            }
        });
    }
    async getOwnedPlaylists(userId: string) {
        return this.db.playlist.findMany({
            where: { ownerId: userId, isLikesPlaylist: false },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                name: true,
                description: true,
                isPublic: true,
                ownerId: true,
                createdAt: true,
                updatedAt: true,
                _count: { select: { tracks: true } },
                tracks: {
                    take: 1,
                    select: { track: { select: { thumbnailUrl: true } } }
                }
            }
        });
    }
}