import { DatabaseConnection } from "@/config";
import { ArtistMeta } from "./ytdlp.ingest.provider";

export class IngestRepository {
    private db = DatabaseConnection.getInstance().getClient();
    
    async exists(source: string, sourceId: string) {
        const result = await this.db.track.findUnique({
            where: {
                source_sourceId: {
                    source: source,
                    sourceId: sourceId,
                },
            },
        });
        if (result) return result;
        return null;
    }
    
    async createTrackAndArtist(data: {
        source: string;
        sourceId: string;
        title: string;
        duration: number;
        thumbnailUrl: string | null;
        artists: ArtistMeta[];
        genres: string[];
    }) {
        return this.db.$transaction(async (tx) => {
            const existing = await tx.track.findUnique({
                where: {
                    source_sourceId: {
                        source: data.source,
                        sourceId: data.sourceId,
                    },
                },
            });
            if (existing) return existing;
            let firstGenreId: number | null = null;
            if (data.genres.length > 0) {
                const genreIds = await Promise.all(
                    data.genres.map(async (g) => {
                        const normalized = g.trim().toLowerCase();
                        let genre = await tx.genre.findUnique({
                            where: {
                                name: normalized,
                            },
                        });
                        if (!genre) {
                            genre = await tx.genre.create({
                                data: {
                                    name: normalized,
                                },
                            });
                        }
                        return genre.id
                    })
                );
                if (genreIds.length > 0) firstGenreId = genreIds[0] || null;
            }
            const track = await tx.track.create({
                data: {
                    source: data.source,
                    sourceId: data.sourceId,
                    title: data.title,
                    duration: data.duration,
                    thumbnailUrl: data.thumbnailUrl,
                    genreId: firstGenreId,
                },
            });
            
            await Promise.all(
                data.artists.map(async (a) => {
                    const normalized = a.name.trim().toLowerCase();
                    let artist;
                    if (a.sourceId) {
                        artist = await tx.artist.upsert({
                            where: {
                                source_sourceId: {
                                    source: data.source,
                                    sourceId: a.sourceId,
                                },
                            },
                            update: {
                                imageUrl: a.imageUrl ?? null,
                            },
                            create: {
                                name: normalized,
                                source: data.source,
                                sourceId: a.sourceId,
                                imageUrl: a.imageUrl ?? null,
                            },
                        });
                    } else {
                        artist = await tx.artist.findFirst({
                            where: {
                                name: normalized,
                                source: data.source,
                            },
                        });
                        
                        if (!artist) {
                            artist = await tx.artist.create({
                                data: {
                                    name: normalized,
                                    source: data.source,
                                    sourceId: null,
                                    imageUrl: a.imageUrl ?? null,
                                },
                            });
                        } else if (a.imageUrl && !artist.imageUrl) {
                            artist = await tx.artist.update({
                                where: { id: artist.id },
                                data: { imageUrl: a.imageUrl },
                            });
                        }
                    }
                    await tx.trackArtist.upsert({
                        where: {
                            trackId_artistId: {
                                trackId: track.id,
                                artistId: artist.id,
                            },
                        },
                        update: {}, // No fields to update; just ensure existence
                        create: {
                            trackId: track.id,
                            artistId: artist.id,
                        },
                    });
                }),
            );
            return track;
        });
    }
}
