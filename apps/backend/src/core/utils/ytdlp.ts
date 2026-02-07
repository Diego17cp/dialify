export class YtdlpUtils {
    static extractArtists(data: {
        artists?: string[];
        artist?: string;
        creator?: string;
        uploader?: string;
    }): string[] {
        if (Array.isArray(data.artists) && data.artists.length > 0) return data.artists;
        if (typeof data.artist === "string") return [data.artist];
        if (typeof data.creator === "string") return [data.creator];
        if (typeof data.uploader === "string") return [data.uploader];
        return [];
    }
}