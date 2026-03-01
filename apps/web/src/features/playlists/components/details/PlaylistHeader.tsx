import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MdEdit, MdLock, MdPublic, MdMusicNote } from "react-icons/md";
import type { PlaylistDetails } from "../../types/playlist";
import defaultAvatar from "@/assets/default-pfp.webp";
import { useEditPlaylist } from "../../hooks/useEditPlaylist";
import { EditPlaylistModal } from "../EditPlaylistModal";

type Props = {
    details: PlaylistDetails;
};

export const PlaylistHeader = ({ details }: Props) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isCoverHovered, setIsCoverHovered] = useState(false);

    const coverUrl = details.tracks?.[0]?.thumbnailUrl ?? null;
    const hasTracks = details.tracks.length > 0;
    const totalTracks = details.pagination.total;
    const isLongDescription = details.description?.length > 120;

    const editPlaylist = useEditPlaylist(details);

    return (
        <>
            <div className="relative px-6 pt-8 pb-6">
                <div className="absolute inset-0 bg-linear-to-b from-gray-800/60 to-transparent pointer-events-none rounded-t-xl" />
                <div className="relative flex flex-col sm:flex-row items-start gap-6">
                    <motion.button
                        className="relative shrink-0 w-44 h-44 rounded-xl overflow-hidden bg-gray-800 shadow-2xl shadow-black/60 cursor-pointer group"
                        onHoverStart={() => setIsCoverHovered(true)}
                        onHoverEnd={() => setIsCoverHovered(false)}
                        onClick={editPlaylist.openEditModal}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {coverUrl ? (
                            <img
                                src={coverUrl}
                                alt={details.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <MdMusicNote className="text-gray-500 text-5xl" />
                            </div>
                        )}
                        <AnimatePresence>
                            {isCoverHovered && (
                                <motion.div
                                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <MdEdit className="text-white text-2xl" />
                                    <span className="text-white text-xs font-semibold">
                                        Choose image
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                    <div className="flex flex-col gap-2 min-w-0 flex-1 pt-1">
                        <div className="flex items-center gap-1.5">
                            {details.isPublic ? (
                                <MdPublic className="text-gray-400 text-sm shrink-0" />
                            ) : (
                                <MdLock className="text-gray-400 text-sm shrink-0" />
                            )}
                            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                {details.isPublic ? "Public" : "Private"} playlist
                            </span>
                        </div>
                        <motion.button
                            onClick={editPlaylist.openEditModal}
                            className="text-left cursor-pointer group"
                            whileTap={{ scale: 0.99 }}
                        >
                            <h1 className="text-white font-black text-4xl sm:text-5xl truncate group-hover:text-gray-200 transition-colors leading-tight">
                                {details.name}
                            </h1>
                        </motion.button>
                        {details.description && (
                            <div className="flex flex-col gap-1">
                                <p className={`text-gray-400 text-sm leading-relaxed ${!isDescriptionExpanded && isLongDescription ? "line-clamp-2" : "line-clamp-none"}`}>
                                    {details.description}
                                </p>
                                {isLongDescription && (
                                    <button
                                        onClick={() => setIsDescriptionExpanded(prev => !prev)}
                                        className="text-gray-500 hover:text-white text-xs font-semibold transition-colors cursor-pointer text-left"
                                    >
                                        {isDescriptionExpanded ? "Show less" : "Show more"}
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Link
                                to={`/profile/${details.ownerId}`}
                                className="flex items-center gap-1.5 hover:underline group"
                            >
                                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-700 shrink-0">
                                    <img
                                        src={defaultAvatar}
                                        alt={details.ownerUsername}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                    />
                                </div>
                                <span className="text-white text-sm font-semibold group-hover:underline">
                                    {details.ownerUsername}
                                </span>
                            </Link>
                            {hasTracks && (
                                <>
                                    <span className="text-gray-600 text-sm">•</span>
                                    <span className="text-gray-400 text-sm">
                                        {totalTracks} {totalTracks === 1 ? "song" : "songs"}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <EditPlaylistModal {...editPlaylist} />
        </>
    );
};