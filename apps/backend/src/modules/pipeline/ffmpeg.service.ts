import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";
import { HLS_CONFIG } from "./pipeline.constants";

const execAsync = promisify(exec)

export class FfmpegService {
    static async generateHLS(inputPath: string, outputDir: string) {
        return new Promise((resolve, reject) => {
            const { BITRATES, SEGMENT_DURATION, PLAYLIST_TYPE } = HLS_CONFIG;
            const varStreamMap = BITRATES.map((_, i) => `a:${i}`).join(" ");
            const args = [
                "-i", inputPath,
                "-vn",                
                ...BITRATES.flatMap((bitrate, i) => [
                    "-map", "0:a:0",
                    `-c:a:${i}`, "aac",
                    `-b:a:${i}`, `${bitrate}k`,
                ]),
                "-f", "hls",
                "-hls_time", String(SEGMENT_DURATION),
                "-hls_playlist_type", PLAYLIST_TYPE,
                "-hls_segment_filename", `${outputDir}/stream_%v/segment_%03d.ts`,
                "-master_pl_name", "master.m3u8",
                "-var_stream_map", varStreamMap,
                `${outputDir}/stream_%v/playlist.m3u8`,
            ];
            console.log("Running FFmpeg with args:", args.join(" "));
            const ffmpeg = spawn("ffmpeg", args, {
                stdio: ["ignore", "pipe", "pipe"]
            });
            let stderr = "";
            ffmpeg.stderr.on("data", (data) => {
                stderr += data.toString();
                if (stderr.includes("time=")) process.stdout.write("\r" + stderr.split("\n").pop());
            });
            ffmpeg.on("close", (code) => {
                if (code === 0) {
                    console.log("FFmpeg completed successfully");
                    resolve(true)
                }
                else {
                    console.error("FFmpeg failed with code", code, "and error:", stderr);
                    console.error("FFmpeg stderr:", stderr);
                    reject(new Error(`FFmpeg exited with code ${code}`));
                }
            })
            ffmpeg.on("error", (err) => {
                console.error("FFmpeg process error:", err);
                reject(err);
            })
        })
    }
    static async optimize(inputPath: string, outputPath: string) {
        const command = `ffmpeg -i "${inputPath}" -vn -c:a aac -b:a 192k -movflags +faststart "${outputPath}"`;
        await execAsync(command);
    }
    static async getDuration(filePath: string): Promise<number> {
        const comand = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
        try {
            const { stdout } = await execAsync(comand);
            return Math.floor(parseFloat(stdout.trim())); // Return duration in seconds as an integer
        } catch (error) {
            console.error("Error getting duration:", error);
            return 0;
        }
    }
    static async getDirectorySize(dirPath: string): Promise<bigint> {
        try {
            const { stdout } = await execAsync(
                process.platform === "win32"
                    ? `powershell -command "(Get-ChildItem -Path '${dirPath}' -Recurse | Measure-Object -Property Length -Sum).Sum"`
                    : `du -sb "${dirPath}" | cut -f1`
            );
            return BigInt(stdout.trim());
        } catch (error) {
            console.error("Error getting directory size:", error);
            return BigInt(0);
        }
    }
}