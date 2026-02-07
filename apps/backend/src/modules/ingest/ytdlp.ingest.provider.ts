import { YtdlpUtils } from "@/core/utils";
import { execa } from "execa";

export interface ArtistMeta {
    name: string;
    sourceId: string | null;
    imageUrl: string | null;
}

export class YtdlpIngestProvider {
    static async fetchMetadata(sourceId: string) {
        const { stdout } = await execa("yt-dlp", [
            `https://www.youtube.com/watch?v=${sourceId}`,
            "--dump-json",
            "--skip-download",
            "--no-warnings",
        ])
        const data = JSON.parse(stdout);
        const artists = YtdlpUtils.extractArtists(data);
        return {
            provider: "youtube" as const,
            providerId: data.id,
            title: data.title,
            duration:
                typeof data.duration === "number"
                    ? data.duration
                    : data.duration && data.duration !== "NA"
                    ? parseInt(data.duration)
                    : null,
            thumbnailUrl: this.extractThumbnail(data),
            artists,
            genres: this.extractGenres(data),
        }
    }
    private static extractThumbnail(data: any): string | null {
        if (Array.isArray(data.thumbnails) && data.thumbnails.length > 0) {
            return data.thumbnails[data.thumbnails.length - 1].url ?? null;
        }
        return data.thumbnail ?? null;
    }
    private static extractGenres(data: any): string[] {
        if (Array.isArray(data.genres)) {
            return data.genres
        }
        if (typeof data.genre === "string") {
            return data.genre.split(",").map((g: string) => g.trim());
        }
        return [];
    }
}