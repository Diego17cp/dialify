import { AnimatePresence, motion } from "motion/react";
import { FaPlus } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { PiBookmarkSimpleFill } from "react-icons/pi";
import { LIBRARY_COLLAPSED_WIDTH } from "../../constants/sidebar.constants";
import type { useLibrarySidebar } from "../../hooks/useLibrarySidebar";
import { LibraryItem } from "./LibraryItem";
import { LibraryEmptyState } from "./LibraryEmptyState";
import { LibrarySkeleton } from "./LibrarySkeleton";
import { CreatePlaylistModal, useCreatePlaylist } from "@/features/playlists";
import { useRef } from "react";

type LibrarySidebarProps = ReturnType<typeof useLibrarySidebar>;

export const LibrarySidebar = ({
    isExpanded, 
    width,
    status,
    canCollapse,
    showCreateLabel,
    toggle, 
    onDragStart, 
    items,
    refetch
}: LibrarySidebarProps) => {
    const listRef = useRef<HTMLDivElement>(null);
    const createPlaylist = useCreatePlaylist(listRef);
    return (
        <>
            <motion.aside
                className="relative hidden md:flex flex-col bg-gray-900 rounded-xl shrink-0 overflow-hidden"
                animate={{ width }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ minWidth: isExpanded ? undefined : LIBRARY_COLLAPSED_WIDTH }}
            >
                <div
                    className={`flex items-center gap-2 px-3 py-3 shrink-0 ${
                        isExpanded ? "justify-between" : "justify-center"
                    }`}
                >
                    <motion.button
                        onClick={canCollapse ? toggle : undefined}
                        className={`flex items-center gap-2 text-gray-400 transition-colors p-1 rounded-lg ${
                            canCollapse
                                ? "hover:text-white cursor-pointer hover:bg-gray-800"
                                : "cursor-default opacity-70"
                        }`}
                        whileHover={canCollapse ? { scale: 1.05 } : {}}
                        whileTap={canCollapse ? { scale: 0.95 } : {}}
                    >
                        <PiBookmarkSimpleFill className="text-xl shrink-0" />
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.span
                                    className="font-bold text-sm whitespace-nowrap overflow-hidden"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Your Library
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                className="flex items-center gap-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {status !== "unauthenticated" && (
                                    <motion.button
                                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 bg-gray-950/40 transition-colors cursor-pointer overflow-hidden"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Create playlist"
                                        onClick={createPlaylist.openCreatePlaylist}
                                    >
                                        <FaPlus className="text-sm shrink-0" />
                                        <AnimatePresence>
                                            {showCreateLabel && (
                                                <motion.span
                                                    className="text-xs font-semibold whitespace-nowrap overflow-hidden"
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    Create
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                )}
                                {canCollapse && (
                                    <motion.button
                                        onClick={toggle}
                                        className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <MdChevronLeft className="text-lg" />
                                    </motion.button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {!isExpanded && status !== "unauthenticated" && (
                    <motion.button
                        className="mx-auto mb-2 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Create playlist"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={createPlaylist.openCreatePlaylist}
                    >
                        <FaPlus className="text-sm" />
                    </motion.button>
                )}
                <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent px-2 pb-4">
                    {status === "loading" && <LibrarySkeleton isExpanded={isExpanded} />}
                    {status === "unauthenticated" && <LibraryEmptyState type="unauthenticated" />}
                    {status === "empty" &&  <LibraryEmptyState type="empty" onCreateClick={createPlaylist.openCreatePlaylist} />}
                    {status === "error" && <LibraryEmptyState type="error" refetch={refetch} />}
                    {status === "ok" && (
                        <div className="flex flex-col gap-0.5">
                            {items.map((item, index) => (
                                <LibraryItem
                                    key={item.id}
                                    item={item}
                                    isExpanded={isExpanded}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {!isExpanded && canCollapse && (
                    <motion.button
                        onClick={toggle}
                        className="mx-auto mb-3 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Expand library"
                    >
                        <MdChevronRight className="text-lg" />
                    </motion.button>
                )}
                {isExpanded && canCollapse && (
                    <div
                        onMouseDown={onDragStart}
                        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-brand-primary/50 transition-colors duration-200 z-10"
                    />
                )}
            </motion.aside>
            <CreatePlaylistModal {...createPlaylist} />
        </>
    );
};