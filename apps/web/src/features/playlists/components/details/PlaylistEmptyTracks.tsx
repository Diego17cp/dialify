import { motion, AnimatePresence } from "motion/react";
import { MdSearch, MdMusicNote } from "react-icons/md";
import { useSearchTracks } from "../../hooks/useSearchTrack"; 
import { useAddTrack } from "../../hooks/useAddTrack";
import { SearchTrackItem } from "./SearchTrackItem";
import { SearchTrackSkeleton } from "./SearchTrackSkeleton";
import type { SearchTrack } from "../../types/playlist";

type Props = {
    playlistId: string;
    search: ReturnType<typeof useSearchTracks>;
    hideHeader?: boolean;
    observerRef: React.RefObject<HTMLDivElement | null>;
};

export const PlaylistEmptyTracks = ({ playlistId, search, hideHeader, observerRef }: Props) => {
    const { addTrack, addedIds } = useAddTrack(playlistId);

    const handlePlay = (_track: SearchTrack) => {
        // TODO: integrar reproductor
    };

    return (
        <motion.div
            className="flex flex-col gap-5 py-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {!hideHeader && (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <MdMusicNote className="text-gray-500 text-xl" />
                        <h3 className="text-white font-bold text-base">
                            Let's find something for your playlist
                        </h3>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Search for songs to add to this playlist.
                    </p>
                </div>
            )}
            <div className="relative max-w-sm">
                <MdSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors ${
                    search.query ? "text-brand-primary" : "text-gray-500"
                }`} />
                <input
                    type="text"
                    value={search.query}
                    onChange={e => search.setQuery(e.target.value)}
                    placeholder="Search for songs..."
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-brand-primary/60 transition-colors"
                />
                <AnimatePresence>
                    {search.isSearching && (
                        <motion.div
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="w-3.5 h-3.5 rounded-full border-2 border-gray-600 border-t-brand-primary"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
                {search.hasSearched && (
                    <motion.div
                        key="results"
                        className="flex flex-col gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {search.isSearching && !search.hasResults ? (
                            <SearchTrackSkeleton />
                        ) : search.hasResults ? (
                            <>
                                {search.tracks.map((track, index) => (
                                    <SearchTrackItem
                                        key={track.id}
                                        track={track}
                                        index={index}
                                        isAdded={addedIds.has(track.id)}
                                        isAdding={false}
                                        onAdd={addTrack}
                                        onPlay={handlePlay}
                                    />
                                ))}
                                <div ref={observerRef} className="h-4" />
                                {search.isFetchingNextPage && (
                                    <div className="flex justify-center py-3">
                                        <motion.div
                                            className="w-4 h-4 rounded-full border-2 border-gray-600 border-t-brand-primary"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                        />
                                    </div>
                                )}
                            </>
                        ) : search.hasQuery ? (
                            <motion.p
                                className="text-gray-500 text-sm px-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                No songs found for "{search.query}"
                            </motion.p>
                        ) : (
                            <motion.p
                                className="text-gray-500 text-sm px-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                Type to search for more songs
                            </motion.p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};