import { motion, AnimatePresence } from "motion/react";
import { MdClose } from "react-icons/md";
import { MdQueueMusic } from "react-icons/md";
import { FaLock, FaGlobe } from "react-icons/fa";
import type { useCreatePlaylist } from "../hooks/useCreatePlaylist";

type CreatePlaylistModalProps = ReturnType<typeof useCreatePlaylist>;

export const CreatePlaylistModal = ({
    isCreatePlaylistOpen,
    closeCreatePlaylist,
    data,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
}: CreatePlaylistModalProps) => {
    return (
        <AnimatePresence>
            {isCreatePlaylistOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCreatePlaylist}
                    />
                    <motion.div
                        className="fixed inset-0 z-61 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-md bg-gray-950 rounded-2xl overflow-hidden shadow-2xl shadow-black/80"
                            initial={{ scale: 0.92, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative h-32 bg-linear-to-br from-brand-primary via-brand-primary-dark to-gray-900 flex items-center justify-center">
                                <div className="absolute top-2 left-4 w-20 h-20 rounded-full bg-white/5 blur-2xl" />
                                <div className="absolute bottom-0 right-8 w-16 h-16 rounded-full bg-brand-primary-light/20 blur-2xl" />
                                <motion.div
                                    className="relative z-10 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl"
                                    initial={{ scale: 0, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.1, type: "spring", damping: 20 }}
                                >
                                    <MdQueueMusic className="text-white text-3xl" />
                                </motion.div>
                                <motion.button
                                    onClick={closeCreatePlaylist}
                                    className="absolute top-3 right-3 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <MdClose className="text-lg" />
                                </motion.button>
                            </div>
                            <div className="px-6 py-5">
                                <h2 className="text-white font-bold text-xl mb-1">
                                    Create playlist
                                </h2>
                                <p className="text-gray-500 text-sm mb-5">
                                    Give your playlist a name and description.
                                </p>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Name <span className="text-red-400">*</span>
                                        </label>
                                        <div className={`relative rounded-xl border transition-colors duration-200 ${
                                            errors.name
                                                ? "border-red-500/60 bg-red-500/5"
                                                : "border-gray-800 bg-gray-900 focus-within:border-brand-primary/60 focus-within:bg-gray-900"
                                        }`}>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                                placeholder="My awesome playlist"
                                                maxLength={100}
                                                className="w-full bg-transparent text-white placeholder-gray-600 text-sm px-4 py-3 rounded-xl focus:outline-none"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600">
                                                {data.name.length}/100
                                            </span>
                                        </div>
                                        <AnimatePresence>
                                            {errors.name && (
                                                <motion.p
                                                    className="text-red-400 text-xs flex items-center gap-1"
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -4 }}
                                                >
                                                    {errors.name}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Description
                                            <span className="text-gray-600 font-normal ml-1 normal-case tracking-normal">
                                                (optional)
                                            </span>
                                        </label>
                                        <div className={`relative rounded-xl border transition-colors duration-200 ${
                                            errors.description
                                                ? "border-red-500/60 bg-red-500/5"
                                                : "border-gray-800 bg-gray-900 focus-within:border-brand-primary/60"
                                        }`}>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => handleChange("description", e.target.value)}
                                                placeholder="Describe your playlist..."
                                                maxLength={300}
                                                rows={3}
                                                className="w-full bg-transparent text-white placeholder-gray-600 text-sm px-4 py-3 rounded-xl focus:outline-none resize-none scrollbar-thin scrollbar-thumb-gray-700"
                                            />
                                            <span className={`absolute right-3 bottom-3 text-xs ${
                                                data.description.length > 280
                                                    ? "text-red-400"
                                                    : "text-gray-600"
                                            }`}>
                                                {data.description.length}/300
                                            </span>
                                        </div>
                                        <AnimatePresence>
                                            {errors.description && (
                                                <motion.p
                                                    className="text-red-400 text-xs"
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -4 }}
                                                >
                                                    {errors.description}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleChange("isPublic", !data.isPublic)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                                            data.isPublic
                                                ? "border-brand-primary/50 bg-brand-primary/10"
                                                : "border-gray-800 bg-gray-900 hover:border-gray-700"
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                            data.isPublic
                                                ? "bg-brand-primary/20 text-brand-primary"
                                                : "bg-gray-800 text-gray-500"
                                        }`}>
                                            {data.isPublic
                                                ? <FaGlobe className="text-sm" />
                                                : <FaLock className="text-sm" />
                                            }
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-white text-sm font-medium">
                                                {data.isPublic ? "Public" : "Private"}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {data.isPublic
                                                    ? "Anyone can find and listen"
                                                    : "Only you can see this playlist"
                                                }
                                            </span>
                                        </div>
                                        <div className={`ml-auto w-10 h-6 rounded-full transition-colors duration-300 relative shrink-0 ${
                                            data.isPublic ? "bg-brand-primary" : "bg-gray-700"
                                        }`}>
                                            <motion.div
                                                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                                                animate={{ left: data.isPublic ? "calc(100% - 20px)" : "4px" }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </div>
                                    </button>
                                    <div className="flex gap-2 mt-1">
                                        <motion.button
                                            type="button"
                                            onClick={closeCreatePlaylist}
                                            className="flex-1 py-2.5 rounded-full text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 text-sm font-semibold transition-colors cursor-pointer"
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <motion.span
                                                        className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    Creating...
                                                </span>
                                            ) : "Create"}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};