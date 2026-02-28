import { LibraryRepository } from "./library.repository";
import { LibraryArtistItem, LibraryItem, LibraryLikesPlaylist, LibraryOwnedPlaylistItem, LibraryPlaylistItem } from "./library.types";

export class LibraryService {
	private static repo = new LibraryRepository();

	static async getUserLibrary(userId: string) {
		const [likesPlaylistRaw, likedPlaylists, likedArtists, ownedPlaylists] =
			await Promise.all([
				this.repo.getLikesPlaylist(userId),
				this.repo.getLikedPlaylists(userId),
				this.repo.getLikedArtists(userId),
				this.repo.getOwnedPlaylists(userId),
			]);
		const likesPlaylist: LibraryLikesPlaylist | null = likesPlaylistRaw
			? {
					type: "likes_playlist",
					id: likesPlaylistRaw.id,
					name: likesPlaylistRaw.name,
					description: likesPlaylistRaw.description,
					coverImageUrl:
						likesPlaylistRaw.tracks[0]?.track.thumbnailUrl || null,
					trackCount: likesPlaylistRaw._count.tracks,
					isPublic: likesPlaylistRaw.isPublic,
					ownerId: likesPlaylistRaw.ownerId,
				}
			: null;
        const mappedPlaylists: LibraryPlaylistItem[] = likedPlaylists
            .filter(l => l.playlist && !l.playlist.isLikesPlaylist)
            .map(l => ({
                type: "playlist",
                id: l.playlist!.id,
                name: l.playlist!.name,
                description: l.playlist!.description,
                coverImageUrl: l.playlist!.tracks[0]?.track.thumbnailUrl || null,
                trackCount: l.playlist!._count.tracks,
                isPublic: l.playlist!.isPublic,
                ownerId: l.playlist!.ownerId,
                likedAt: l.createdAt,
            }));
        const mappedArtists: LibraryArtistItem[] = likedArtists
            .filter(l => l.artist)
            .map(l => ({
                type: "artist",
                id: l.artist!.id,
                name: l.artist!.name,
                imageUrl: l.artist!.imageUrl,
                source: l.artist!.source,
                likedAt: l.createdAt,
            }));
        const items: LibraryItem[] = [
            ...mappedPlaylists,
            ...mappedArtists
        ].sort((a, b) => b.likedAt.getTime() - a.likedAt.getTime());
        const owned: LibraryOwnedPlaylistItem[] = ownedPlaylists.map(p => ({
            type: "owned_playlist",
            id: p.id,
            name: p.name,
            description: p.description,
            coverImageUrl: p.tracks[0]?.track.thumbnailUrl || null,
            trackCount: p._count.tracks,
            isPublic: p.isPublic,
            ownerId: p.ownerId!,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
        return {
            likesPlaylist,
            items,
            ownedPlaylists: owned
        }
	}
}
