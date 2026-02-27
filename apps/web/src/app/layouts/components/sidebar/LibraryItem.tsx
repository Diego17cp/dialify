import { motion, AnimatePresence } from "motion/react";
import { FaMusic } from "react-icons/fa";
import { RiUserFill } from "react-icons/ri";
import { MdQueueMusic } from "react-icons/md";
import type { LibraryItem as LibraryItemType } from "../../types/sidebar.types";
import { PiMusicNoteFill } from "react-icons/pi";

type Props = {
    item: LibraryItemType;
    isExpanded: boolean;
    index: number;
};

const typeIcon = {
    playlist: <MdQueueMusic className="text-xs text-gray-400" />,
    album: <FaMusic className="text-xs text-gray-400" />,
    artist: <RiUserFill className="text-xs text-gray-400" />,
};

export const LibraryItem = ({ item, isExpanded, index }: Props) => {
    return (
        <motion.button
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800/60 transition-colors duration-150 cursor-pointer group text-left"
            title={!isExpanded ? item.title : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className={`shrink-0 overflow-hidden bg-gray-800 ${item.type === "artist" ? "rounded-full" : "rounded-md"} ${isExpanded ? "size-10" : "size-9"}`}>
                {item.coverUrl ? (
                    <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <PiMusicNoteFill className="text-gray-500 text-xl" />
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
                        <span className="text-white text-sm font-medium truncate group-hover:text-accent-light transition-colors">
                            {item.title}
                        </span>
                        <div className="flex items-center gap-1">
                            {typeIcon[item.type]}
                            <span className="text-gray-500 text-xs truncate">
                                {item.subtitle}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};