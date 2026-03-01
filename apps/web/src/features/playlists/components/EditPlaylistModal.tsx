import { AnimatePresence, motion } from "motion/react";
import { MdClose, MdEdit, MdMusicNote } from "react-icons/md";
import { FaGlobe, FaLock } from "react-icons/fa";
import type { useEditPlaylist } from "../hooks/useEditPlaylist";

type EditPlaylistModalProps = ReturnType<typeof useEditPlaylist>;

export const EditPlaylistModal = ({
    isEditModalOpen,
    closeEditModal,
    form,
    errors,
    handleChange,
    handleCoverClick,
    handleCoverChange,
    handleSubmit,
    fileInputRef,
    isUpdating,
}: EditPlaylistModalProps) => {
    return (
        <AnimatePresence>
            {isEditModalOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeEditModal}
                    />
                    <motion.div
                        className="fixed inset-0 z-61 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-lg bg-gray-950 rounded-2xl overflow-hidden shadow-2xl shadow-black/80"
                            initial={{ scale: 0.92, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                                <h2 className="text-white font-bold text-base">Edit playlist</h2>
                                <motion.button
                                    onClick={closeEditModal}
                                    className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Close edit modal"
                                >
                                    <MdClose className="text-lg" />
                                </motion.button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="p-5 flex flex-col gap-5">
                                    <div className="flex gap-4 flex-col md:flex-row">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleCoverChange}
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={handleCoverClick}
                                            className="relative rounded-xl overflow-hidden bg-gray-800 cursor-pointer w-1/2 self-center group md:w-36 md:aspect-auto md:self-stretch md:shrink-0"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {form.coverPreview ? (
                                                <img
                                                    src={form.coverPreview}
                                                    alt="Cover"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 py-10 md:py-0">
                                                    <MdMusicNote className="text-gray-500 text-5xl md:text-4xl" />
                                                    <span className="text-gray-500 text-xs font-medium md:hidden">
                                                        Tap to choose image
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 
                                                            bg-black/0 group-hover:bg-black/60
                                                            md:opacity-0 md:group-hover:opacity-100
                                                            transition-all duration-200 
                                                            flex flex-col items-center justify-center gap-1.5
                                                            opacity-0 group-hover:opacity-100">
                                                <MdEdit className="text-white text-2xl" />
                                                <span className="text-white text-xs font-semibold text-center px-2">
                                                    Choose image
                                                </span>
                                            </div>
                                            {form.coverPreview && (
                                                <div className="absolute bottom-2 right-2 md:hidden bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                                                    <MdEdit className="text-white text-xs" />
                                                    <span className="text-white text-xs font-medium">Change</span>
                                                </div>
                                            )}
                                        </motion.button>
                                        <div className="flex flex-col gap-3 flex-1 min-w-0">
                                            <div className="flex flex-col gap-1.5">
                                                <div className={`relative rounded-xl border transition-colors duration-200 ${
                                                    errors.name
                                                        ? "border-red-500/60 bg-red-500/5"
                                                        : "border-gray-800 bg-gray-900 focus-within:border-brand-primary/60"
                                                }`}>
                                                    <input
                                                        type="text"
                                                        value={form.name}
                                                        onChange={e => handleChange("name", e.target.value)}
                                                        placeholder="Playlist name"
                                                        maxLength={100}
                                                        className="w-full bg-transparent text-white placeholder-gray-600 text-sm px-4 py-2.5 rounded-xl focus:outline-none font-medium pr-14"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600">
                                                        {form.name.length}/100
                                                    </span>
                                                </div>
                                                <AnimatePresence>
                                                    {errors.name && (
                                                        <motion.p
                                                            className="text-red-400 text-xs"
                                                            initial={{ opacity: 0, y: -4 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -4 }}
                                                        >
                                                            {errors.name}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <div className="flex flex-col gap-1.5 flex-1">
                                                <div className={`relative rounded-xl border transition-colors duration-200 h-full ${
                                                    errors.description
                                                        ? "border-red-500/60 bg-red-500/5"
                                                        : "border-gray-800 bg-gray-900 focus-within:border-brand-primary/60"
                                                }`}>
                                                    <textarea
                                                        value={form.description}
                                                        onChange={e => handleChange("description", e.target.value)}
                                                        placeholder="Add an optional description..."
                                                        maxLength={300}
                                                        className="w-full h-full bg-transparent text-white placeholder-gray-600 text-sm px-4 py-2.5 rounded-xl focus:outline-none resize-none scrollbar-thin scrollbar-thumb-gray-700 min-h-20 pb-7 md:pb-2.5"
                                                    />
                                                    <span className={`absolute right-3 bottom-2.5 p-1 rounded-md bg-gray-900/80 text-xs ${
                                                        form.description.length > 280 ? "text-red-400" : "text-gray-600"
                                                    }`}>
                                                        {form.description.length}/300
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
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <motion.button
                                            type="button"
                                            onClick={() => handleChange("isPublic", !form.isPublic)}
                                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border flex-1 transition-all duration-200 cursor-pointer text-left ${
                                                form.isPublic
                                                    ? "border-brand-primary/50 bg-brand-primary/10"
                                                    : "border-gray-800 bg-gray-900 hover:border-gray-700"
                                            }`}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                                form.isPublic
                                                    ? "bg-brand-primary/20 text-brand-primary"
                                                    : "bg-gray-800 text-gray-500"
                                            }`}>
                                                {form.isPublic
                                                    ? <FaGlobe className="text-xs" />
                                                    : <FaLock className="text-xs" />
                                                }
                                            </div>
                                            <span className="text-white text-sm font-medium">
                                                {form.isPublic ? "Make private" : "Make public"}
                                            </span>
                                            <div className={`ml-auto w-9 h-5 rounded-full transition-colors duration-300 relative shrink-0 ${
                                                form.isPublic ? "bg-brand-primary" : "bg-gray-700"
                                            }`}>
                                                <motion.div
                                                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                                                    animate={{ left: form.isPublic ? "calc(100% - 18px)" : "2px" }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            </div>
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                            whileHover={!isUpdating ? { scale: 1.02 } : {}}
                                            whileTap={!isUpdating ? { scale: 0.97 } : {}}
                                        >
                                            {isUpdating ? (
                                                <span className="flex items-center gap-2">
                                                    <motion.span
                                                        className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white block"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    Saving...
                                                </span>
                                            ) : "Save"}
                                        </motion.button>
                                    </div>
                                    <p className="text-gray-600 text-xs text-center leading-relaxed">
                                        By proceeding, you confirm that the information entered is accurate and complies
                                        with our{" "}
                                        <span className="text-gray-500 hover:text-white transition-colors cursor-pointer underline">
                                            content guidelines
                                        </span>
                                        . Changes will be reflected immediately.
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};