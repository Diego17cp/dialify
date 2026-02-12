import express, { Router } from "express";
import { STORAGE_CONFIG } from "@/modules/pipeline/pipeline.constants";

export const staticMiddleware: Router = Router();

staticMiddleware.use(
    "/hls",
    express.static(STORAGE_CONFIG.HLS_DIR, {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith(".m3u8")) {
                res.set("Content-Type", "application/vnd.apple.mpegurl");
                res.set("Cache-Control", "public, max-age=3600"); // 1 hora
            } else if (filePath.endsWith(".ts")) {
                res.set("Content-Type", "video/MP2T");
                res.set("Cache-Control", "public, max-age=86400"); // 24 horas
            }
        },
    })
);