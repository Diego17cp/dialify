import { execa } from "execa";
import { SearchResultDTO } from "./search.dto";

export class YtdlpProvider {
	static async search(
		query: string,
		limit: number = 10,
	): Promise<SearchResultDTO[]> {
		const { stdout } = await execa("yt-dlp", [
			`ytsearch${limit}:${query}`,
			"--print",
			"%(id)s|||%(title)s|||%(duration)s|||%(thumbnail)s|||%(uploader)s",
			"--skip-download",
			"--no-warnings",
		]);

		const lines = stdout.split("\n").filter(Boolean);
		return lines.map((line) => {
			const [id, title, duration, thumbnail, uploader] = line.split("|||");
			return {
				provider: "youtube" as const,
				providerId: id!,
				title: title!,
				duration:
					duration && duration !== "NA" ? parseInt(duration) : null,
				thumbnailUrl:
					thumbnail && thumbnail !== "NA" ? thumbnail : null,
				artists: uploader && uploader !== "NA" ? [uploader] : [],
			};
		});
	}
}
