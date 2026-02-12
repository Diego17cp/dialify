import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec)

export class YtdlpService {
    static async download(sourceId: string, outputPath: string) {
        const url = `https://www.youtube.com/watch?v=${sourceId}`;
        const command = `
            yt-dlp -f bestaudio
            -o "${outputPath}/%(id)s.%(ext)s"
            ${url}
            `;
        await execAsync(command);
    }
}