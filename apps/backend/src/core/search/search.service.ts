import { YtdlpProvider } from "./ytdlp.provider";
import { SearchResultDTO } from "./search.dto";

export class SearchService {
	private static normalize(query: string): string {
		return query.trim().toLowerCase().replace(/\s+/g, " ");
	}

	private static TTL = 1000 * 60 * 60; // 1 hour
	private static MAX_CACHE_SIZE = 100;

	private static cache: Map<string, SearchResultDTO[]> = new Map();
	private static inflight: Map<string, Promise<SearchResultDTO[]>> = new Map();
	private static refreshing = new Set<string>();

	static async search(query: string): Promise<SearchResultDTO[]> {
		const normalized = this.normalize(query);
		if (this.cache.has(normalized)) {
			this.refreshInBackground(normalized);
			return this.cache.get(normalized)!;
		}
		if (this.inflight.has(normalized))
			return this.inflight.get(normalized)!;

		const searchPromise = YtdlpProvider.search(normalized)
			.then((res) => {
                this.saveCache(normalized, res);
				return res;
			})
			.finally(() => {
				this.inflight.delete(normalized);
			});
		this.inflight.set(normalized, searchPromise);
		return searchPromise;
	}
	private static refreshInBackground(query: string) {
		if (this.refreshing.has(query)) return;
		this.refreshing.add(query);
		YtdlpProvider.search(query)
            .then((res) => this.saveCache(query, res))
            .catch(() => {})
            .finally(() => this.refreshing.delete(query));
	}
	private static saveCache(query: string, results: SearchResultDTO[]) {
		if (this.cache.size > this.MAX_CACHE_SIZE) {
			const oldestKey = this.cache.keys().next().value;
			this.cache.delete(oldestKey!);
		}
		this.cache.set(query, results);
		setTimeout(() => this.cache.delete(query), this.TTL); // Cache for 1 hour
	}
}
