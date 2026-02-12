import path from "node:path";

export const STORAGE_CONFIG = {
	BASE_DIR: path.resolve("storage"),
	RAW_DIR: path.resolve("storage/raw"),
	HLS_DIR: path.resolve("storage/hls"),
	TEMP_DIR: path.resolve("storage/temp"),
	MAX_STORAGE_GB: 100,
};

export const HLS_CONFIG = {
	BITRATES: [64, 128, 192, 256],
	SEGMENT_DURATION: 6,
	PLAYLIST_TYPE: "vod",
};

export const CACHE_TTL = {
	TRACK_METADATA: 60 * 60 * 24,
	HLS_PLAYLIST: 60 * 60,
};
