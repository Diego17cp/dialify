import { motion } from "motion/react";
import { MdLock } from "react-icons/md";
import { Link } from "react-router";

export const PlaylistBlocked = () => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center h-full py-24 gap-4 text-center px-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="size-18 rounded-full bg-gray-800 flex items-center justify-center">
                <MdLock className="text-gray-500 text-3xl" />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-white font-bold text-2xl">This playlist is private</p>
                <p className="text-gray-500 text-sm max-w-xs">
                    Only the owner can see the contents of this playlist.
                </p>
            </div>
            <Link to="/">
                <motion.button
                    className="mt-2 px-5 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold transition-colors cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Go home
                </motion.button>
            </Link>
        </motion.div>
    );
};