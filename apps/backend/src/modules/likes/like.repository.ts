import { DatabaseConnection } from "@/config";
import { LikeTargetType } from "generated/prisma/enums";

export class LikesRepository {
    private db = DatabaseConnection.getInstance().getClient();
    async findLike(userId: string, targetId: number, targetType: LikeTargetType) {
        const whereClause: any = {
            userId,
            targetId,
            targetType,
        };
        if (targetType === "TRACK") whereClause.trackId = targetId;
        if (targetType === "PLAYLIST") whereClause.playlistId = targetId;
        if (targetType === "ARTIST") whereClause.artistId = targetId;

        return this.db.like.findFirst({ where: whereClause });
    }
    async toggleLike(id: number, isActive: boolean) {
        return this.db.like.update({
            where: { id },
            data: { isActive }
        })
    }
    async create(userId: string, targetId: number, targetType: LikeTargetType = "TRACK") {
        return this.db.like.create({
            data: {
                userId,
                trackId: targetType === "TRACK" ? targetId : null,
                playlistId: targetType === "PLAYLIST" ? targetId : null,
                artistId: targetType === "ARTIST" ? targetId : null,
                targetId,
                targetType: targetType,
                isActive: true
            }
        })
    }
    async findLikesPlaylist(userId: string) {
        return this.db.playlist.findFirst({
            where: {
                ownerId: userId,
                isLikesPlaylist: true,
            }
        })
    }
    async createLikesPlaylist(userId: string) {
        return this.db.$transaction(async (tx) => {
            const playlist = await tx.playlist.create({
                data: {
                    name: "Liked Songs",
                    description: "A playlist containing all your liked songs",
                    ownerId: userId,
                    isPublic: false,
                    isLikesPlaylist: true
                }
            })
            await tx.like.create({
                data: {
                    userId,
                    targetId: playlist.id,
                    playlistId: playlist.id,
                    targetType: "PLAYLIST",
                    isActive: true
                }
            })
            return playlist;
        })
    }
    async playlistHasTrack(playlistId: number, trackId: number) {
        return this.db.playlistTrack.findFirst({
            where: {
                playlistId,
                trackId
            }
        })
    }
    async findUserLikesCollection(userId: string) {
        return this.db.$transaction(async (tx) => {
            const [playlists, artists, likesPlaylist] = await Promise.all([
                tx.like.findMany({
                    where: {
                        userId,
                        targetType: "PLAYLIST",
                        isActive: true,
                    },
                    include: {
                        playlist: {
                            include: {
                                _count: {
                                    select: { tracks: true },
                                },
                                tracks: {
                                    take: 1,
                                    select: {
                                        track: { select: { thumbnailUrl: true } },
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                }),
                tx.like.findMany({
                    where: {
                        userId,
                        targetType: "ARTIST",
                        isActive: true,
                    },
                    include: {
                        artist: true,
                    },
                    orderBy: { createdAt: "desc" },
                }),
                tx.playlist.findFirst({
                    where: {
                        ownerId: userId,
                        isLikesPlaylist: true,
                    },
                    include: {
                        _count: {
                            select: { tracks: true },
                        },
                    },
                }),
            ]);

            return { playlists, artists, likesPlaylist };
        });
    }
    async isLiked(userId: string, targetId: number, targetType: LikeTargetType) {
        const like = await this.findLike(userId, targetId, targetType);
        return like ? like.isActive : false;
    }
    async getLikesCount(userId: string) {
        return this.db.$transaction(async (tx) => {
            const [tracks, playlists, artists] = await Promise.all([
                tx.like.count({
                    where: { userId, targetType: "TRACK", isActive: true },
                }),
                tx.like.count({
                    where: { userId, targetType: "PLAYLIST", isActive: true },
                }),
                tx.like.count({
                    where: { userId, targetType: "ARTIST", isActive: true },
                }),
            ]);

            return { tracks, playlists, artists };
        });
    }
}