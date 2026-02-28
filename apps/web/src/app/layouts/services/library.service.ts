import { apiClient } from "@/core/api";

export type LibraryLikesPlaylist = {
    type: "likes_playlist";
    id: number;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    trackCount: number;
    isPublic: boolean;
    ownerId: string;
};

export type LibraryPlaylistItem = {
    type: "playlist";
    id: number;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    trackCount: number;
    isPublic: boolean;
    ownerId: string;
    likedAt: string;
};

export type LibraryArtistItem = {
    type: "artist";
    id: number;
    name: string;
    imageUrl: string | null;
    source: string;
    likedAt: string;
};

export type LibraryOwnedPlaylistItem = {
    type: "owned_playlist";
    id: number;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    trackCount: number;
    isPublic: boolean;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
};

export type LibraryItem = LibraryPlaylistItem | LibraryArtistItem | LibraryOwnedPlaylistItem;

export type LibraryResponse = {
    success: boolean;
    data: {
        likesPlaylist: LibraryLikesPlaylist | null;
        items: LibraryItem[];
        ownedPlaylists: LibraryOwnedPlaylistItem[];
    };
};

export const libraryService = {
    getLibraryItems: async () => {
        const { data } = await apiClient.get<LibraryResponse>("/users/library");
        return data;
    },
};