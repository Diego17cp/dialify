import { ArtistMeta } from "@/modules/ingest/ytdlp.ingest.provider";

export class YtdlpUtils {
	static extractArtists(data: any): ArtistMeta[] {
		let artists: string[] = [];

		if (Array.isArray(data.artists) && data.artists.length > 0) {
			artists = data.artists
				.map((a: any) => (typeof a === "string" ? a : a.name || ""))
				.filter(Boolean);
		} else if (typeof data.artist === "string") {
			artists = [data.artist];
		} else if (typeof data.creator === "string") {
			artists = [data.creator];
		} else if (typeof data.uploader === "string") {
			artists = [data.uploader];
		}

		artists = artists
			.map((artist) => artist.replace(/\s*\(Official.*?\)/i, "").trim())
			.filter((artist) => artist && artist !== "NA");

		return artists.map((artist) => ({
			name: artist,
			sourceId: data.channel_id || data.uploader_id || null,
			imageUrl: this.extractArtistImage(data),
		}));
	}

	private static extractArtistImage(data: any): string | null {
		if (Array.isArray(data.thumbnails) && data.thumbnails.length > 0) {
			return data.thumbnails[data.thumbnails.length - 1].url ?? null;
		}
		return null;
	}
}
