import { DatabaseConnection } from "@/config";

export class SearchHistoryRepository {
    private db = DatabaseConnection.getInstance().getClient();
    private readonly MAX_ENTRIES_PER_USER = 100;

    async upsert(userId: string, query: string, meta?: {
        resultsCount?: number;
        hasPlayed?: boolean;
    }) {
        return this.db.searchHistory.upsert({
            where: {
                userId_query: {
                    userId,
                    query,
                }
            },
            update: {
                searchCount: { increment: 1 },
                lastSearchedAt: new Date(),
                ...(meta?.resultsCount && { resultsCount: meta.resultsCount }),
                ...(meta?.hasPlayed !== undefined && { hasPlayed: meta.hasPlayed }),
            },
            create: {
                userId,
                query,
                searchCount: 1,
                resultsCount: meta?.resultsCount ?? null,
                hasPlayed: meta?.hasPlayed ?? false,
            }
        })
    }
    async getByUserId(userId: string, limit: number = 50) {
        const res = await this.db.searchHistory.findMany({
            where: { userId },
            orderBy: [
                { searchCount: 'desc' },
                { lastSearchedAt: 'desc' },
            ],
            take: limit
        })
        return res;
    }
    async cleanupOldEntries(userId: string) {
        const count = await this.db.searchHistory.count({ where: { userId } });
        if (count <= this.MAX_ENTRIES_PER_USER) return;
        const excessCount = count - this.MAX_ENTRIES_PER_USER;
        const entriesToDelete = await this.db.searchHistory.findMany({
            where: { userId },
            orderBy: [
                { searchCount: 'asc' },
                { lastSearchedAt: 'asc' },
            ],
            take: excessCount,
        });
        const idsToDelete = entriesToDelete.map(entry => entry.id);
        await this.db.searchHistory.deleteMany({
            where: { id: { in: idsToDelete } },
        });
    }
    async getUserStats(userId: string) {
        return this.db.searchHistory.aggregate({
            where: { userId },
            _count: { id: true },
            _sum: { searchCount: true },
            _avg: { resultsCount: true },
        });
    }
    async getSuggestions(userId: string, currentQuery: string, limit: number = 10) {
        const normalizedQuery = currentQuery.trim().toLowerCase();
        
        return this.db.searchHistory.findMany({
            where: {
                userId,
                query: {
                    contains: normalizedQuery,
                    mode: 'insensitive',
                },
            },
            orderBy: [
                { searchCount: 'desc' },
                { lastSearchedAt: 'desc' },
            ],
            take: limit,
        });
    }
}