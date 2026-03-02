import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { FaPlay, FaPlus, FaCheck } from "react-icons/fa";
import type { SearchTrack } from "../../types/playlist";

type Props = {
    track: SearchTrack;
    index: number;
    isAdded: boolean;
    isAdding: boolean;
    onAdd: (trackId: string) => void;
    onPlay: (track: SearchTrack) => void;
};

const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
};

export const SearchTrackItem = ({ track, index, isAdded, isAdding, onAdd, onPlay }: Props) => {
    const [isCoverHovered, setIsCoverHovered] = useState(false);

    return (
        <motion.div
            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-800/50 group cursor-pointer transition-colors w-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.2 }}
            onClick={() => onPlay(track)}
            onMouseEnter={() => setIsCoverHovered(true)}
            onMouseLeave={() => setIsCoverHovered(false)}
        >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                <img
                    src={track.thumbnailUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                />
                <AnimatePresence>
                    {isCoverHovered && (
                        <motion.div
                            className="absolute inset-0 bg-black/60 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                        >
                            <FaPlay className="text-white text-sm" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <span className="text-white text-sm sm:text-base font-medium truncate group-hover:text-accent-light transition-colors">
                    {track.title}
                </span>
                <div className="flex items-center gap-1 flex-wrap mt-0.5">
                    {track.artists.map((artist, i) => (
                        <span key={artist.id}>
                            <Link
                                to={`/artist/${artist.id}`}
                                onClick={e => e.stopPropagation()}
                                className="text-gray-500 text-xs sm:text-sm hover:text-white hover:underline transition-colors"
                            >
                                {artist.name}
                            </Link>
                            {i < track.artists.length - 1 && (
                                <span className="text-gray-600 text-xs">,</span>
                            )}
                        </span>
                    ))}
                </div>
            </div>
            <span className="text-gray-400 text-xs sm:text-sm shrink-0 hidden sm:block tabular-nums">
                {formatDuration(track.duration)}
            </span>
            <motion.button
                onClick={e => {
                    e.stopPropagation();
                    if (!isAdded) onAdd(track.id);
                }}
                disabled={isAdded || isAdding}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${
                    isAdded
                        ? "bg-brand-primary-light/20 text-brand-primary-light border border-brand-primary/30"
                        : "bg-gray-700 hover:bg-gray-600 text-white border border-transparent"
                }`}
                whileHover={!isAdded ? { scale: 1.05 } : {}}
                whileTap={!isAdded ? { scale: 0.95 } : {}}
            >
                <AnimatePresence mode="wait">
                    {isAdded ? (
                        <motion.span
                            key="check"
                            className="flex items-center gap-1.5"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <FaCheck className="text-xs sm:text-sm" />
                            <span className="hidden sm:inline">Added</span>
                        </motion.span>
                    ) : (
                        <motion.span
                            key="add"
                            className="flex items-center gap-1.5"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <FaPlus className="text-xs sm:text-sm" />
                            <span className="hidden sm:inline">Add</span>
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </motion.div>
    );
};