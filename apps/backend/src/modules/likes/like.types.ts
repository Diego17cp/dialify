export type LikeTargetType = "TRACK" | "PLAYLIST" | "ARTIST";

export interface LikeToggleInput {
    userId: string;
    targetId: number;
    targetType: LikeTargetType;
}

export interface LikedItem {
    id: number;
    targetId: number;
    targetType: LikeTargetType;
    likedAt: Date;
    isActive: boolean;
}

export interface UserLikesResponse {
    playlists: {
        id: number;
        name: string;
        description: string | null;
        coverImageUrl: string | null;
        trackCount: number;
        isPublic: boolean;
        ownerId: string;
        likedAt: Date;
    }[];
    artists: {
        id: number;
        name: string;
        imageUrl: string | null;
        source: string;
        likedAt: Date;
    }[];
    tracks: {
        playlistId: number;
        trackCount: number;
    };
}
