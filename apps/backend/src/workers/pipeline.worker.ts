import { Worker } from "bullmq";
import { PipelineService } from "@/modules/pipeline";

const service = new PipelineService();

new Worker('pipeline', async job => {
    await service.processTrack(job.data.trackId);
})