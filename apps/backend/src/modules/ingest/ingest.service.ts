import { IngestDTO } from "./ingest.dto";
import { IngestRepository } from "./ingest.repository";
import { YtdlpIngestProvider } from "./ytdlp.ingest.provider";

export class IngestService {
    private static repo = new IngestRepository();
    static async ingest(input: IngestDTO) {
        const meta = await YtdlpIngestProvider.fetchMetadata(input.sourceId);
        const track = await this.repo.createTrackAndArtist({
            source: meta.provider,
            sourceId: meta.providerId,
            title: meta.title,
            duration: meta.duration ?? 0,
            thumbnailUrl: meta.thumbnailUrl,
            artists: meta.artists,
            genres: meta.genres,
        })
        return track;
    }
}