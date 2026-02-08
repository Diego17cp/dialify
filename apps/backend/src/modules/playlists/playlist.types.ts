export interface CreatePlaylistDTO {
	name: string;
	description?: string;
	ownerId: string;
	isPublic?: boolean;
}
export interface UpdatePlaylistDTO {
    name?: string;
    description?: string;
    isPublic?: boolean;
}
export type PlaylistTrackInput = { trackId: number } | { sourceId: string };
export interface AddTracksDTO {
	playlistId: number;
	tracks: PlaylistTrackInput[];
}
