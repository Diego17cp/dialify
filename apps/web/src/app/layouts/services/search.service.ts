import { apiClient } from "@/core/api";
import type { RecentTrack, SearchResult } from "../types/search.types";

export type SearchResponse = {
    data: SearchResult[];
    success: boolean;
};
export type PlaybackHistoryResponse = {
    data: {
        trackId: number;
        track: RecentTrack
    }[];
    success: boolean;
}

export const searchService = {
    search: async (query: string): Promise<SearchResponse> => {
        const { data } = await apiClient.get<SearchResponse>("/search", {
            params: { q: query },
        });
        return data;
    },
    playbackHistory: async (limit: number = 30): Promise<PlaybackHistoryResponse> => {
        const { data } = await apiClient.get<PlaybackHistoryResponse>("/playback/history", {
            params: { limit },
        });
        return data;
    }
};