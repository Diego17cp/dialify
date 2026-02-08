import { AppError } from "@/core";
import { PlaylistRepository } from "./playlist.repository";
import { AddTracksDTO, CreatePlaylistDTO, UpdatePlaylistDTO } from "./playlist.types";
import { IngestService } from "../ingest/ingest.service";

export class PlaylistService {
    private static repo = new PlaylistRepository();

    private static async ensurePlaylistExists(playlistId: number) {
        const playlist = await this.repo.findById(playlistId);
        if (!playlist) throw new AppError("Playlist not found", 404);
        return playlist;
    }
    static async createPlaylist(data: CreatePlaylistDTO) {
        if (!data.name || !data.ownerId) {
            throw new AppError("Name and ownerId are required to create a playlist", 400);
        }
        return this.repo.create(data);
    }
    static async updatePlaylist(playlistId: number, data: UpdatePlaylistDTO) {
        await this.ensurePlaylistExists(playlistId);
        return this.repo.update(playlistId, data);
    }
    static async deletePlaylist(playlistId: number) {
        await this.ensurePlaylistExists(playlistId);
        return this.repo.delete(playlistId);
    }
    static async getPlaylistByOwnerId(ownerId: string) {
        const playlists = await this.repo.listByOwnerId(ownerId);
        if (!playlists || playlists.length === 0) throw new AppError("No playlists found for this owner", 404);
        return playlists.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            isPublic: p.isPublic,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            trackCount: p._count.tracks,
            coverImageUrl: p.tracks.length > 0 ? p.tracks[0]?.track?.thumbnailUrl : null
        }));
    }
    static async getPlaylistDetails(
        playlistId: number,
        options: { page: number; limit: number }
    ) {
        const playlist = await this.ensurePlaylistExists(playlistId);
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const tracks = await this.repo.getPlaylistTracks(playlistId, { skip, limit});
        const totalTracks = await this.repo.countTracks(playlistId);
        return {
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            isPublic: playlist.isPublic,
            ownerId: playlist.ownerId,
            createdAt: playlist.createdAt,
            updatedAt: playlist.updatedAt,
            tracks: tracks.map((t) => ({
                id: t.track.id,
                title: t.track.title,
                duration: t.track.duration,
                thumbnailUrl: t.track.thumbnailUrl,
                source: t.track.source,
                sourceId: t.track.sourceId,
                artists: t.track.artists.map((a) => ({
                    id: a.artist.id,
                    name: a.artist.name,
                })),
                genre: t.track.genre?.name || null,
                orderIndex: t.orderIndex,
            })),
            pagination: {
                page,
                limit,
                total: totalTracks,
                totalPages: Math.ceil(totalTracks / limit),
                hasNext: page * limit < totalTracks,
                hasPrev: page > 1,
            },
        };
    }
    static async addTracks(data: AddTracksDTO) {
        await this.ensurePlaylistExists(data.playlistId);

        const trackIds = await Promise.all(
            data.tracks.map(async (item) => {
                if ("trackId" in item) return item.trackId;
                const track = await IngestService.ingest({
                    source: "youtube",
                    sourceId: item.sourceId
                });
                return track.id;
            })
        )
        const existingTracks = await this.repo.getExistingTrackIds(
            data.playlistId,
            trackIds
        )
        const existingTrackIds = new Set(existingTracks.map(t => t.trackId));
        const newTrackIds = trackIds.filter(id => !existingTrackIds.has(id));
        if (newTrackIds.length > 0) await this.repo.addTracks(data.playlistId, newTrackIds);

        return {
            added: newTrackIds.length,
            skipped: trackIds.length - newTrackIds.length
        }
    }
    static async removeTrack(playlistId: number, trackId: number) {
        await this.ensurePlaylistExists(playlistId);
        const trackExists = await this.repo.trackExistsInPlaylist(playlistId, trackId);
        if (!trackExists) throw new AppError("Track not found in playlist", 404);
        await this.repo.removeTrack(playlistId, trackId);
    }
}