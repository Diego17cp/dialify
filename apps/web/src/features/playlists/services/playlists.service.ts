import { apiClient } from "@/core/api";

export const playlistsService = {
    createPlaylist: async (data: {
        name: string;
        description?: string;
        isPublic?: boolean;
    }) => {
        const res = await apiClient.post("/playlists", data);
        return res.data.data;
    }
}