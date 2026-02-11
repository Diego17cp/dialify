import { execa } from "execa";
import { SearchResultDTO } from "./search.dto";
import { YtdlpUtils } from "../utils";
import { SearchHistoryService } from "@/modules/search-history";

export class YtdlpProvider {
	static async search(
		query: string,
		limit: number = 10,
		userId?: string
	): Promise<SearchResultDTO[]> {
		const { stdout } = await execa("yt-dlp", [
			`ytsearch${limit}:${query}`,
			"--dump-json",
			"--skip-download",
			"--no-warnings",
		]);

		const lines = stdout.split("\n").filter(Boolean);
		const results = lines.map((line) => {
			const data = JSON.parse(line);
			const {
				id,
				title,
				duration,
				thumbnail,
			} = data;
			const artistsList = YtdlpUtils.extractArtists(data);
			return {
				provider: "youtube" as const,
				providerId: id!,
				title: title!,
				displayTitle:
					artistsList.length > 0
						? `${title!} - ${artistsList[0]?.name}`
						: title!,
				duration:
					duration && duration !== "NA" ? parseInt(duration) : null,
				thumbnailUrl:
					thumbnail && thumbnail !== "NA" ? thumbnail : null,
				artists: artistsList.map((artist) => artist.name),
			};
		});
		if (userId) {
			SearchHistoryService.addEntry(userId, query, {
				resultsCount: results.length,
				hasPlayed: false, // We can update this later when the user plays a track from the results
			}).catch((err) => {
				console.error("Failed to add search history entry:", err);
			});
		}
		return results;
	}
}
