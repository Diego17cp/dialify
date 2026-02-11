import { AppError } from "@/core";
import { SearchHistoryRepository } from "./searchHistory.repository";

export class SearchHistoryService {
    private static repository = new SearchHistoryRepository();

    static async addEntry(userId: string, query: string, meta?: {
        resultsCount?: number;
        hasPlayed?: boolean;
    }) {
        if (!userId || !query?.trim()) {
            throw new AppError("User ID and query are required", 400);
        }
        const normalizedQuery = query.trim().toLowerCase();
        const entry = await this.repository.upsert(userId, normalizedQuery, meta);
        await this.repository.cleanupOldEntries(userId).catch(console.error);
        return entry;
    }
    static async getUserHistory(userId: string) {
        if (!userId) throw new AppError("User ID is required", 400);
        return await this.repository.getByUserId(userId);
    }
    static async getSuggestions(userId: string, query: string, limit: number = 10) {
        if (!userId || !query?.trim()) return [];
        const normalizedQuery = query.trim().toLowerCase();
        return await this.repository.getSuggestions(userId, normalizedQuery, limit);
    }
    static async getUserStats(userId: string) {
        if (!userId) throw new AppError("User ID is required", 400);
        return await this.repository.getUserStats(userId);
    }
}