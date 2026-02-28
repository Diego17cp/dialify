export type LibraryItemType = "likes_playlist" | "playlist" | "artist" | "owned_playlist";

export interface LibraryLikesPlaylist {
    type: "likes_playlist";
    id: number;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    trackCount: number;
    isPublic: boolean;
    ownerId: string | null;
}

export interface LibraryPlaylistItem {
    type: "playlist";
    id: number;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    trackCount: number;
    isPublic: boolean;
    ownerId: string | null;
    likedAt: Date;
}

export interface LibraryArtistItem {
    type: "artist";
    id: number;
    name: string;
    imageUrl: string | null;
    source: string;
    likedAt: Date;
}

export interface LibraryOwnedPlaylistItem {
    type: "owned_playlist";
    id: number;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    trackCount: number;
    isPublic: boolean;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type LibraryItem =
    | LibraryPlaylistItem
    | LibraryArtistItem
    | LibraryOwnedPlaylistItem;

export interface LibraryResponse {
    likesPlaylist: LibraryLikesPlaylist | null;
    items: LibraryItem[];
    ownedPlaylists: LibraryOwnedPlaylistItem[];
}