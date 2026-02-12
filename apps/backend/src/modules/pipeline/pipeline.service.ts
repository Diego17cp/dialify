import path from "node:path";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import { PipelineRepository } from "./pipeline.repository";
import { YtdlpService } from "./ytdlp.service";
import { FfmpegService } from "./ffmpeg.service";
import { AppError } from "@/core";
import { HLS_CONFIG, STORAGE_CONFIG } from "./pipeline.constants";
import { TrackStatus } from "generated/prisma/enums";

export class PipelineService {
    private repo = new PipelineRepository();
    async processTrack(trackId: number) {
        const track = await this.repo.findById(trackId);
        if (!track || !track.sourceId) throw new AppError(`Track ${trackId} not found or missing sourceId`, 404);
        const hlsPath = path.join(
            STORAGE_CONFIG.HLS_DIR,
            track.sourceId,
            "master.m3u8"
        );
        if (existsSync(hlsPath)) {
            console.log(`Track ${trackId} already processed, skipping`);
            if (track.status !== TrackStatus.READY) {
                const duration = await FfmpegService.getDuration(
                    path.join(STORAGE_CONFIG.HLS_DIR, track.sourceId)
                )
                const fileSize = await FfmpegService.getDirectorySize(
                    path.join(STORAGE_CONFIG.HLS_DIR, track.sourceId)
                )
                await this.repo.markReady(trackId, {
                    hlsPath: `/hls/${track.sourceId}/master.m3u8`,
                    duration,
                    bitrates: HLS_CONFIG.BITRATES,
                    fileSize,
                })
            }
            return { cached: true, hlsPath }
        }
        await this.repo.updateStatus(trackId, TrackStatus.PROCESSING);
        const rawDir = STORAGE_CONFIG.RAW_DIR;
        const hlsDir = path.join(STORAGE_CONFIG.HLS_DIR, track.sourceId);

        fs.mkdir(rawDir, { recursive: true });
        fs.mkdir(hlsDir, { recursive: true });

        let rawFilePath: string | null = null;

        try {
            console.log(`Downloading track ${trackId} with sourceId ${track.sourceId}...`);
            await YtdlpService.download(track.sourceId!, rawDir);
            const files = await fs.readdir(rawDir);
            const downloadedFile = files.find(f => f.startsWith(track.sourceId!));
            if (!downloadedFile) throw new AppError(`Downloaded file for track ${trackId} not found`, 500);

            rawFilePath = path.join(rawDir, downloadedFile);
            console.log(`Dowloaded: ${rawFilePath}`)
            console.log(`Generating HLS for track ${track.sourceId}...`);
            await FfmpegService.generateHLS(rawFilePath, hlsDir);
            console.log(`HLS generated at ${hlsDir}`);
            const duration = await FfmpegService.getDuration(rawFilePath);
            const fileSize = await FfmpegService.getDirectorySize(rawFilePath);
            await this.repo.markReady(trackId, {
                hlsPath: `/hls/${track.sourceId}/master.m3u8`,
                duration,
                bitrates: HLS_CONFIG.BITRATES,
                fileSize,
            });
            if (rawFilePath && existsSync(rawFilePath)) {
                await fs.unlink(rawFilePath);
                console.log(`Cleaned up raw file ${rawFilePath}`);
            }
            return {
                cached: false,
                hlsPath: `/hls/${track.sourceId}/master.m3u8`
            }
        } catch (error) {
            console.log(`Error processing track ${trackId}:`, error);
            if (rawFilePath && existsSync(rawFilePath)) {
                await fs.unlink(rawFilePath).catch(console.error);
            }
            if (existsSync(hlsDir)) {
                await fs.rm(hlsDir, { recursive: true, force: true }).catch(console.error);
            }
            await this.repo.markFailed(trackId);
            throw error;
        }
    }
    async cleanupOldTracks(limitGB: number = STORAGE_CONFIG.MAX_STORAGE_GB) {
        const currentSize = await FfmpegService.getDirectorySize(STORAGE_CONFIG.HLS_DIR);
        const currentGB = Number(currentSize) / (1024 ** 3);

        if (currentGB < limitGB * 0.9) {
            console.log(`Storage OK: ${currentGB.toFixed(2)}GB / ${limitGB}GB`);
            return { cleaned: false, currentGB };
        }

        console.log(`Storage near limit: ${currentGB.toFixed(2)}GB / ${limitGB}GB`);

        const oldTracks = await this.repo.getOldestReadyTracks(10);
        let freedSpace = 0;

        for (const track of oldTracks) {
            if (!track.sourceId) continue;

            const trackDir = path.join(STORAGE_CONFIG.HLS_DIR, track.sourceId);
            if (existsSync(trackDir)) {
                const size = await FfmpegService.getDirectorySize(trackDir);
                await fs.rm(trackDir, { recursive: true, force: true });
                await this.repo.updateStatus(track.id, TrackStatus.PENDING);
                freedSpace += Number(size);
                console.log(`Cleaned track ${track.id} (${(Number(size) / 1024 ** 2).toFixed(2)}MB)`);
            }

            if (freedSpace / (1024 ** 3) > 10) break;
        }

        return { cleaned: true, freedGB: freedSpace / (1024 ** 3) };
    }
}