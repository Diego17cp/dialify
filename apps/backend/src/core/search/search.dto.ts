import { z } from "zod";

export const searchQuerySchema = z.object({
    q: z.string().min(1, "Search query cannot be empty").max(100, "Search query cannot exceed 100 characters")
})
export type SearchResultDTO = {
    provider: "youtube";
    providerId: string;
    title: string;
    duration: number | null; // in seconds
    thumbnailUrl: string | null;
    artists: string[];
}