import { execa } from "execa";
import { SearchResultDTO } from "./search.dto";
import { YtdlpUtils } from "../utils";

export class YtdlpProvider {
	static async search(
		query: string,
		limit: number = 10,
	): Promise<SearchResultDTO[]> {
		const { stdout } = await execa("yt-dlp", [
			`ytsearch${limit}:${query}`,
			"--dump-json",
			"--skip-download",
			"--no-warnings",
		]);

		const lines = stdout.split("\n").filter(Boolean);
		return lines.map((line) => {
			const data = JSON.parse(line);
			const {
				id,
				title,
				duration,
				thumbnail,
				artist,
				artists,
				creator,
				uploader,
			} = data;
			const artistsList = YtdlpUtils.extractArtists({
				artists: artists ? artists : undefined,
				artist,
				creator,
				uploader: uploader || "",
			});
			return {
				provider: "youtube" as const,
				providerId: id!,
				title: title!,
				displayTitle:
					artistsList.length > 0
						? `${title!} - ${artistsList[0]}`
						: title!,
				duration:
					duration && duration !== "NA" ? parseInt(duration) : null,
				thumbnailUrl:
					thumbnail && thumbnail !== "NA" ? thumbnail : null,
				artists: artistsList,
			};
		});
	}
}
