export type RecentTrack = {
    id: string;
    title: string;
    artists: string[];
    thumbnailUrl: string;
    duration?: string;
    provider: "youtube",
    providerId: string;
};

export type SearchResult = {
    id: string;
    title: string;
    artists: string[];
    thumbnailUrl: string;
    type: "track" | "artist" | "album";
    provider: "youtube",
    providerId: string;
};