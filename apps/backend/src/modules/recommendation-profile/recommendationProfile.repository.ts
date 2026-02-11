import { DatabaseConnection } from "@/config";
import { ArtistStatsMap, GenreStatsMap, SearchStatsMap, TrackStatsMap } from "./recommendationProfile.types";

export class RecommendationProfileRepository {
    private db = DatabaseConnection.getInstance().getClient();
    
    async findByUserId(userId: string) {
        return this.db.recommendationProfile.findUnique({
            where: { userId }
        })
    }
    
    async create(userId: string) {
        return this.db.recommendationProfile.create({
            data: {
                userId,
                artistStats: {},
                genreStats: {},
                trackStats: {},
                searchStats: {},
                diversityScore: 0.5
            }
        })
    }
    
    async update(
        userId: string, 
        artistStats: ArtistStatsMap, 
        genreStats: GenreStatsMap,
        trackStats: TrackStatsMap,
        searchStats: SearchStatsMap,
        diversityScore: number
    ) {
        return this.db.recommendationProfile.update({
            where: { userId },
            data: {
                artistStats: artistStats as any,
                genreStats: genreStats as any,
                trackStats: trackStats as any,
                searchStats: searchStats as any,
                diversityScore,
            }
        })
    }
    
    async findPlaybackSignals(userId: string) {
        return this.db.playbackHistory.findMany({
            where: { userId },
            include: {
                track: {
                    include: {
                        artists: {
                            select: {
                                artist: true
                            }
                        },
                        genre: true,
                    }
                }
            },
            orderBy: { playedAt: "desc" },
            take: 1000,
        })
    }
    
    async findLikeSignals(userId: string) {
        return this.db.like.findMany({
            where: { 
                userId,
                targetType: "TRACK"
            },
            include: {
                track: {
                    include: {
                        artists: {
                            select: {
                                artist: true
                            }
                        },
                        genre: true,
                    }
                }
            }
        })
    }
    
    async findSearchSignals(userId: string) {
        return this.db.searchHistory.findMany({
            where: { userId },
            orderBy: { searchedAt: "desc" },
            take: 100,
        })
    }
    
    async findRecommendedTracks(options: {
        artistIds: number[];
        genres: string[];
        excludeTrackIds: number[];
        limit: number;
        exploreRate: number;
    }) {
        const { artistIds, genres, excludeTrackIds, limit, exploreRate } = options;
        const exploitCount = Math.floor(limit * (1 - exploreRate));
        const exploreCount = limit - exploitCount;

        let exploitTracks: any[] = [];
        
        if (exploitCount > 0 && (artistIds.length > 0 || genres.length > 0)) {
            const whereClause: any = {
                OR: [
                    ...(artistIds.length > 0 ? [{
                        artists: {
                            some: {
                                artistId: { in: artistIds }
                            }
                        }
                    }] : []),
                    ...(genres.length > 0 ? [{
                        genre: { 
                            name: { in: genres } 
                        }
                    }] : [])
                ]
            };
            
            if (excludeTrackIds.length > 0) {
                whereClause.id = { notIn: excludeTrackIds };
            }
            
            exploitTracks = await this.db.track.findMany({
                where: whereClause,
                include: {
                    artists: {
                        include: { artist: true }
                    },
                    genre: true,
                },
                take: exploitCount,
                orderBy: { createdAt: "desc" },
            });
        }
        
        let exploreTracks: any[] = [];
        
        if (exploreCount > 0) {
            const excludeClause = excludeTrackIds.length > 0 
                ? `WHERE id NOT IN (${excludeTrackIds.join(",")})`
                : '';
            
            exploreTracks = await this.db.$queryRawUnsafe(`
                SELECT t.*, 
                        json_agg(
                            json_build_object(
                                'id', a.id,
                                'name', a.name,
                                'source', a.source
                            )
                        ) FILTER (WHERE a.id IS NOT NULL) as artists,
                        json_build_object(
                            'id', g.id,
                            'name', g.name
                        ) as genre
                FROM tracks t
                LEFT JOIN track_artists ta ON t.id = ta.track_id
                LEFT JOIN artists a ON ta.artist_id = a.id
                LEFT JOIN genres g ON t.genre_id = g.id
                ${excludeClause}
                GROUP BY t.id, g.id
                ORDER BY RANDOM()
                LIMIT ${exploreCount}
            `);
        }
        
        return [...exploitTracks, ...exploreTracks];
    }
}