import { motion, AnimatePresence } from "motion/react";
import { RiUserFill } from "react-icons/ri";
import { MdQueueMusic } from "react-icons/md";
import type { LibrarySidebarItem } from "../../types/sidebar.types";
import { PiHeartFill, PiMusicNoteFill } from "react-icons/pi";

type Props = {
    item: LibrarySidebarItem;
    isExpanded: boolean;
    index: number;
};

const TypeIcon = ({ type }: { type: LibrarySidebarItem["type"] }) => {
    switch (type) {
        case "likes_playlist": return <PiHeartFill className="text-xs text-brand-primary" />;
        case "artist":         return <RiUserFill className="text-xs text-gray-400" />;
        case "playlist":
        case "owned_playlist": return <MdQueueMusic className="text-xs text-gray-400" />;
    }
};
const typeSubtitle: Record<LibrarySidebarItem["type"], string> = {
    likes_playlist: "Playlist",
    playlist: "Playlist",
    owned_playlist: "Playlist",
    artist: "Artist",
};

export const LibraryItem = ({ item, isExpanded, index }: Props) => {
    const isArtist = item.type === "artist";
    const isLikes = item.type === "likes_playlist";
    return (
        // TODO: Add navigation functionality to show the library item details when clicked
        <motion.button
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800/60 transition-colors duration-150 cursor-pointer group text-left"
            title={!isExpanded ? item.title : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            whileTap={{ scale: 0.98 }}
        >
            <div
                className={`shrink-0 overflow-hidden ${isArtist ? "rounded-full" : "rounded-md"} ${isLikes ? "bg-linear-to-br from-brand-primary/80 via-brand-light to-accent/65" : "bg-gray-800"} ${isExpanded ? "size-10" : "size-9"}`}
            >
                {item.coverUrl ? (
                    <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        {isLikes
                            ? <PiHeartFill className="text-white text-xl" />
                            : <PiMusicNoteFill className="text-gray-500 text-xl" />
                        }
                    </div>
                )}
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="flex flex-col min-w-0 flex-1"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className={`text-sm font-medium truncate transition-colors group-hover:text-accent-light ${isLikes ? "text-white" : "text-gray-300"}`}>
                            {item.title}
                        </span>
                        <div className="flex items-center gap-1">
                            <TypeIcon type={item.type} />
                            <span className="text-gray-500 text-xs truncate">
                                {item.subtitle ?? typeSubtitle[item.type]}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};