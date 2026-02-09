import { LikeTargetType } from "generated/prisma/enums";
import { PlaylistRepository } from "../playlists/playlist.repository";
import { LikesRepository } from "./like.repository";
import { LikeToggleInput, UserLikesResponse } from "./like.types";

export class LikesService {
    private static repo = new LikesRepository();
    private static playlistRepo = new PlaylistRepository();

    static async toggleLike(input: LikeToggleInput) {
        const { userId, targetId, targetType } = input;
        const existingLike = await this.repo.findLike(userId, targetId, targetType);
        if (existingLike) {
            const newState = !existingLike.isActive;
            await this.repo.toggleLike(existingLike.id, newState);
            if (targetType === "TRACK") await this.handleTrackLikePlaylist(userId, targetId, newState);
            return { liked: newState, action: newState ? "liked" : "unliked" };
        }
        await this.repo.create(userId, targetId, targetType);
        if (targetType === "TRACK") await this.handleTrackLikePlaylist(userId, targetId, true);
        return { liked: true, action: "liked" };
    }
    private static async handleTrackLikePlaylist(userId: string, trackId: number, shouldAdd: boolean) {
        let likesPlaylist = await this.repo.findLikesPlaylist(userId);
        if (!likesPlaylist) likesPlaylist = await this.repo.createLikesPlaylist(userId);
        if (shouldAdd) {
            const exists = await this.repo.playlistHasTrack(
                likesPlaylist.id,
                trackId
            )
            if (!exists) await this.playlistRepo.addTracks(
                likesPlaylist.id,
                [trackId]
            )
        } else await this.playlistRepo.removeTrack(likesPlaylist.id, trackId);
    }
    static async getUserLikesCollection(userId: string): Promise<UserLikesResponse> {
        const { playlists, artists, likesPlaylist } = await this.repo.findUserLikesCollection(userId);
        return {
            playlists: playlists
                .filter(like => like.playlist && !like.playlist.isLikesPlaylist)
                .map(like => ({
                    id: like.playlist!.id,
                    name: like.playlist!.name,
                    description: like.playlist!.description,
                    // TODO: Scale this properly to allow upload of custom cover images for playlists in DB
                    coverImageUrl: like.playlist!.tracks[0]?.track.thumbnailUrl || null,
                    trackCount: like.playlist!._count.tracks,
                    isPublic: like.playlist!.isPublic,
                    ownerId: like.playlist!.ownerId!,
                    likedAt: like.createdAt
                })),
            artists: artists.map(like => ({
                id: like.artist!.id,
                name: like.artist!.name,
                imageUrl: like.artist!.imageUrl,
                source: like.artist!.source,
                likedAt: like.createdAt
            })),
            tracks: {
                playlistId: likesPlaylist?.id || 0,
                trackCount: likesPlaylist?._count.tracks || 0
            }
        }
    }
    static async isLiked(
        userId: string,
        targetId: number,
        targetType: LikeTargetType
    ) {
        return this.repo.isLiked(userId, targetId, targetType);
    }

    static async getLikesStats(userId: string) {
        return this.repo.getLikesCount(userId);
    }

    static async toggleTrackLike(userId: string, trackId: number) {
        return this.toggleLike({ userId, targetId: trackId, targetType: "TRACK" });
    }
    static async togglePlaylistLike(userId: string, playlistId: number) {
        return this.toggleLike({
            userId,
            targetId: playlistId,
            targetType: "PLAYLIST",
        });
    }
    static async toggleArtistLike(userId: string, artistId: number) {
        return this.toggleLike({ userId, targetId: artistId, targetType: "ARTIST" });
    }
}