import z from "zod";

export const ingestSchema = z.object({
    source: z.literal("youtube"),
    sourceId: z.string().min(3),
})
export type IngestDTO = z.infer<typeof ingestSchema>;