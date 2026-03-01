export type LikeTargetType = "TRACK" | "PLAYLIST" | "ARTIST";

export interface LikeToggleInput {
    userId: string;
    targetId: string;
    targetType: LikeTargetType;
}

export interface LikedItem {
    id: string;
    targetId: string;
    targetType: LikeTargetType;
    likedAt: Date;
    isActive: boolean;
}

export interface UserLikesResponse {
    playlists: {
        id: string;
        name: string;
        description: string | null;
        coverImageUrl: string | null;
        trackCount: number;
        isPublic: boolean;
        ownerId: string;
        likedAt: Date;
    }[];
    artists: {
        id: string;
        name: string;
        imageUrl: string | null;
        source: string;
        likedAt: Date;
    }[];
    tracks: {
        playlistId: string;
        trackCount: number;
    };
}
