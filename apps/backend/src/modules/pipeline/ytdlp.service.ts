import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec)

export class YtdlpService {
    static async download(sourceId: string, outputPath: string) {
        const url = `https://www.youtube.com/watch?v=${sourceId}`;
        const command = `yt-dlp -f bestaudio -o "${outputPath}/%(id)s.%(ext)s" "${url}"`;
        console.log(`Executing command: ${command}`);
        try {
            const { stdout, stderr } = await execAsync(command, {
                maxBuffer: 1024 * 1024 * 10, // 10 MB
            });
            if (stderr && !stderr.includes("has already been downloaded")) {
                console.warn("yt-dlp stderr:", stderr);
            }
            console.log("yt-dlp stdout:", stdout);
            return outputPath;
        } catch (err) {
            console.error("yt-dlp error:", err);
            throw new Error(`Failed to download video ${sourceId}: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
}