// import { pipelineQueue } from "../pipeline";
import { pipelineMemoryQueue } from "../pipeline";
import { IngestDTO } from "./ingest.dto";
import { IngestRepository } from "./ingest.repository";
import { YtdlpIngestProvider } from "./ytdlp.ingest.provider";

export class IngestService {
    private static repo = new IngestRepository();
    static async ingest(input: IngestDTO) {
        const existing = await this.repo.exists("youtube", input.sourceId);
        if (existing) return {
            track: existing,
            status: existing.status,
            alreadyExists: true,
        }
        const meta = await YtdlpIngestProvider.fetchMetadata(input.sourceId);
        const track = await this.repo.createTrackAndArtist({
            source: meta.provider,
            sourceId: meta.providerId,
            title: meta.title,
            duration: meta.duration ?? 0,
            thumbnailUrl: meta.thumbnailUrl,
            artists: meta.artists,
            genres: meta.genres,
        });

        // USE THIS WHEN WE HAVE A PROPER QUEUE IMPLEMENTATION WITH BULLMQ WITH REDIS

        // await pipelineQueue.add("process-track", {
        //     trackId: track.id,
        // });

        // TEMPORARY IN-MEMORY QUEUE FOR TESTING
        await pipelineMemoryQueue.add({
            trackId: track.id,
        });
        return {
            track,
            status: track.status,
            alreadyExists: false,
        };
    }
}