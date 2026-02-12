import { PipelineService } from './pipeline.service';

interface Job {
    id: string;
    trackId: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: Date;
    error?: string;
}

class InMemoryQueue {
    private queue: Job[] = [];
    private processing: boolean = false;
    private service = new PipelineService();

    async add(data: { trackId: number }) {
        const job: Job = {
            id: `${Date.now()}-${data.trackId}`,
            trackId: data.trackId,
            status: 'pending',
            createdAt: new Date(),
        }
        this.queue.push(job);
        console.log(`Added job ${job.id} for track ${data.trackId} (queue size: ${this.queue.length})`);
        
        if (!this.processing) this.processQueue();
        return job;
    }
    private async processQueue() {
        if (this.processing) return;
        this.processing = true;
        while (this.queue.length > 0) {
            const job = this.queue.shift();
            if (!job) break;
            try {
                job.status = 'processing';
                console.log(`Processing job ${job.id} for track ${job.trackId}`);
                await this.service.processTrack(job.trackId);
                job.status = 'completed';
                console.log(`Completed job ${job.id} for track ${job.trackId}`);
            } catch (err) {
                job.status = 'failed';
                job.error = err instanceof Error ? err.message : String(err);
                console.error(`Failed job ${job.id} for track ${job.trackId}:`, job.error);
                // this.queue.push(job);
                // console.log(`Re-queued job ${job.id} for track ${job.trackId} (queue size: ${this.queue.length})`);
            }
        }
        this.processing = false;
    }
}

export const pipelineMemoryQueue = new InMemoryQueue();