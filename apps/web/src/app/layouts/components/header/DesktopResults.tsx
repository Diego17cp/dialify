import { motion, AnimatePresence } from "motion/react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { SearchSkeleton } from "./SearchSkeleton";
import { SearchTrackItem } from "./SearchTrackItem";
import type { useSearchDropdown } from "../../hooks/useSearchDropdown";
import { MdErrorOutline } from "react-icons/md";

type DesktopResultsProps = ReturnType<typeof useSearchDropdown>;

export const DesktopResults = ({
    isDropdownOpen,
    isSearching,
    isError,
    results,
    recentTracks,
    hasQuery,
    hasRecents,
    hasResults,
    showEmpty,
    dropdownRef,
    closeDropdown,
    isRecentError,
    isRecentLoading,
}: DesktopResultsProps) => {
    const showRecents = !hasQuery && hasRecents;
    const showNothing = !hasQuery && !hasRecents;

    return (
        <AnimatePresence>
            {isDropdownOpen && (
                <motion.div
                    ref={dropdownRef}
                    className="absolute top-[calc(100%+10px)] left-0 w-full min-w-72 lg:min-w-96 xl:min-w-105 bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent p-2">
                        {isSearching && (
                            <div className="py-2">
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
                                    Searching...
                                </p>
                                <SearchSkeleton />
                            </div>
                        )}
                        {(isError || isRecentError) && !isSearching && !isRecentLoading && (
                            <motion.div
                                className="flex flex-col items-center justify-center py-8 gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <MdErrorOutline className="text-red-500 text-2xl" />
                                <p className="text-gray-500 text-sm">Something went wrong. Try again.</p>
                            </motion.div>
                        )}
                        {!isSearching && !isError && !isRecentError && !isRecentLoading && hasQuery && hasResults && (
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-3 mb-2 pt-1">
                                    Results
                                </p>
                                {results.map((track, i) => (
                                    <SearchTrackItem
                                        key={track.id}
                                        track={track}
                                        index={i}
                                        onClick={closeDropdown}
                                    />
                                ))}
                            </div>
                        )}
                        {showEmpty && (
                            <motion.div
                                className="flex flex-col items-center justify-center py-8 gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FiSearch className="text-gray-600 text-2xl" />
                                <p className="text-gray-500 text-sm">No results found</p>
                            </motion.div>
                        )}
                        {!isSearching && showRecents && !isRecentLoading && !isRecentError && (
                            <div>
                                <div className="flex items-center gap-2 px-3 mb-2 pt-1">
                                    <FaClockRotateLeft className="text-gray-500 text-xs" />
                                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
                                        Recent plays
                                    </p>
                                </div>
                                {recentTracks.map((recent, i) => (
                                    <SearchTrackItem
                                        key={recent.track.id}
                                        track={recent.track}
                                        index={i}
                                        onClick={closeDropdown}
                                    />
                                ))}
                            </div>
                        )}
                        {showNothing && (
                            <motion.div
                                className="flex flex-col items-center justify-center py-8 gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FiSearch className="text-gray-600 text-2xl" />
                                <p className="text-gray-500 text-sm">Search for artists, songs or podcasts</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};