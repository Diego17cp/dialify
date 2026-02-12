import { PlaybackService } from "../playback-history";
import { PlaybackSession } from "./playbackSession.types";
import { TrackRepository } from "../tracks/track.repository";
import { RecommendationProfileService } from "../recommendation-profile";
import { AppError } from "@/core";

export class PlaybackSessionService {
    private static sessions = new Map<string, PlaybackSession>();
    private static readonly SESSION_TIMEOUT = 1000 * 60 * 60 * 3; // 3 hours

    static startCleanupInterval() {
        setInterval(() => {
            this.cleanupStaleSessions();
        }, 1000 * 60 * 30); // 30 minutes
    }

    private static cleanupStaleSessions() {
        const now = Date.now();
        let cleaned = 0;

        for (const [sessionId, session] of this.sessions.entries()) {
            const age = now - session.startTime;
            if (age > this.SESSION_TIMEOUT) {
                this.sessions.delete(sessionId);
                cleaned++;
                console.log(`Cleaned stale session ${sessionId} (${Math.floor(age / 1000 / 60)}min old)`);
            }
        }

        if (cleaned > 0) {
            console.log(`Cleaned ${cleaned} stale sessions. Active: ${this.sessions.size}`);
        }
    }

    static async startSession(data: {
        userId: string;
        trackId: number;
        source: PlaybackSession['source'];
        searchQuery?: string;
        playlistId?: number;
        autoplayEnabled?: boolean;
        queue?: number[];
    }) {
        const trackRepo = new TrackRepository();
        const track = await trackRepo.findById(data.trackId);
        if (!track) throw new AppError("Track not found", 404);

        const existingSession = this.getUserSession(data.userId);
        if (existingSession) {
            console.log(`Closing existing session for user ${data.userId}`);
            await this.endSession(existingSession.sessionId);
        }

        const sessionId = `${data.userId}-${Date.now()}`;
        
        const session: PlaybackSession = {
            sessionId,
            userId: data.userId,
            trackId: data.trackId,
            startTime: Date.now(),
            totalPauseDuration: 0,
            source: data.source,
            ...(data.searchQuery && { searchQuery: data.searchQuery }),
            ...(data.playlistId && { playlistId: data.playlistId }),
            autoplayEnabled: data.autoplayEnabled ?? false,
            queue: data.queue || [],
        };

        this.sessions.set(sessionId, session);
        console.log(`Started session ${sessionId} for track ${data.trackId} (active: ${this.sessions.size})`);

        return session;
    }

    static pauseSession(sessionId: string) {
        const session = this.sessions.get(sessionId);
        if (!session) throw new AppError("Session not found", 404);

        if (session.pausedAt) {
            console.log(`Session ${sessionId} already paused`);
            return session;
        }

        session.pausedAt = Date.now();
        console.log(`Paused session ${sessionId}`);
        return session;
    }

    static resumeSession(sessionId: string) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new AppError("Session not found", 404);
        }

        if (!session.pausedAt) {
            console.log(`Session ${sessionId} not paused`);
            return session;
        }

        const pauseDuration = Date.now() - session.pausedAt;
        session.totalPauseDuration += pauseDuration;
        session.pausedAt = undefined;

        console.log(`Resumed session ${sessionId} (paused for ${Math.floor(pauseDuration / 1000)}s)`);
        return session;
    }

    static async endSession(sessionId: string) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new AppError("Session not found", 404);
        }

        const endTime = session.pausedAt || Date.now();
        const totalElapsed = endTime - session.startTime;
        const playDuration = Math.floor((totalElapsed - session.totalPauseDuration) / 1000);

        const trackRepo = new TrackRepository();
        const track = await trackRepo.findById(session.trackId);

        if (!track || !track.duration) {
            console.warn(`Cannot record playback: track ${session.trackId} missing duration`);
            this.sessions.delete(sessionId);
            return null;
        }

        await PlaybackService.recordPlayback({
            userId: session.userId,
            trackId: session.trackId,
            playDuration,
            trackDuration: track.duration,
            wasSkipped: playDuration < track.duration * 0.3,
            source: session.source,
            ...(session.searchQuery && { searchQuery: session.searchQuery }),
        });

        console.log(`Ended session ${sessionId} (played ${playDuration}s / ${track.duration}s)`);

        if (session.autoplayEnabled && session.queue.length > 0) {
            const nextTrackId = session.queue.shift()!;
            this.sessions.delete(sessionId);

            return this.startSession({
                userId: session.userId,
                trackId: nextTrackId,
                source: 'autoplay',
                autoplayEnabled: true,
                queue: session.queue,
            });
        }
        if (session.autoplayEnabled) {
            const recommendations = await RecommendationProfileService.getRecommendations(
                session.userId,
                { limit: 10, excludeTrackIds: [session.trackId], exploreRate: 0.3 }
            );

            if (recommendations.length > 0) {
                this.sessions.delete(sessionId);

                return this.startSession({
                    userId: session.userId,
                    trackId: recommendations[0].id,
                    source: 'autoplay',
                    autoplayEnabled: true,
                    queue: recommendations.slice(1).map(t => t.id),
                });
            }
        }
        this.sessions.delete(sessionId);
        return null;
    }

    static getSession(sessionId: string): PlaybackSession | undefined {
        return this.sessions.get(sessionId);
    }

    static getUserSession(userId: string): PlaybackSession | undefined {
        return Array.from(this.sessions.values()).find(s => s.userId === userId);
    }
    static getStats() {
        return {
            activeSessions: this.sessions.size,
            sessions: Array.from(this.sessions.values()).map(s => ({
                sessionId: s.sessionId,
                userId: s.userId,
                trackId: s.trackId,
                isPaused: !!s.pausedAt,
                duration: Math.floor((Date.now() - s.startTime) / 1000),
            })),
        };
    }
}

PlaybackSessionService.startCleanupInterval();