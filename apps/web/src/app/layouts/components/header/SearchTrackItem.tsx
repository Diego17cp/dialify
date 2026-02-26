import { motion } from "motion/react";
import { FaMusic } from "react-icons/fa";
import type { RecentTrack, SearchResult } from "../../types/search.types";

type Props = {
    track: RecentTrack | SearchResult;
    index: number;
    onClick: () => void;
};

export const SearchTrackItem = ({ track, index, onClick }: Props) => {
    return (
        <motion.button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/70 transition-colors duration-150 cursor-pointer group text-left"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.2 }}
            onClick={onClick}
            whileTap={{ scale: 0.99 }}
        >
            <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-800">
                {track.thumbnailUrl ? (
                    <img
                        src={track.thumbnailUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FaMusic className="text-gray-500 text-sm" />
                    </div>
                )}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-white text-sm font-medium truncate group-hover:text-accent-light transition-colors">
                    {track.title}
                </span>
                <span className="text-gray-500 text-xs truncate">{track.artists.join(", ")}</span>
            </div>
            {"type" in track && (
                <span className="ml-auto shrink-0 text-xs text-gray-600 capitalize">
                    {track.type}
                </span>
            )}
        </motion.button>
    );
};