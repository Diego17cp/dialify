import { Link } from "react-router";
import { motion } from "motion/react";
import { FaPlus } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";

type Props = {
    type: "unauthenticated" | "empty" | "error";
    onCreateClick?: () => void;
    refetch?: () => void;
};

export const LibraryEmptyState = ({ type, onCreateClick, refetch }: Props) => {
    const content = {
        unauthenticated: {
            icon: <MdLibraryMusic className="text-3xl text-gray-500" />,
            title: "Your library",
            description: "Create an account to enjoy your saved songs, playlists and artists.",
            action: (
                <Link to="/register">
                    <motion.button
                        className="cursor-pointer bg-white hover:bg-gray-200 text-black font-bold text-xs px-4 py-2 rounded-full transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Sign up free
                    </motion.button>
                </Link>
            ),
        },
        empty: {
            icon: <MdLibraryMusic className="text-3xl text-gray-500" />,
            title: "Create your first playlist",
            description: "It's easy, we'll help you!",
            action: (
                <motion.button
                    className="cursor-pointer bg-white hover:bg-gray-200 text-black font-bold text-xs px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onCreateClick}
                >
                    <FaPlus className="text-xs" />
                    Create playlist
                </motion.button>
            ),
        },
        error: {
            icon: <MdLibraryMusic className="text-3xl text-red-500/60" />,
            title: "Something went wrong",
            description: "We couldn't load your library. Try again later.",
            action: (
                <motion.button
                    className="cursor-pointer text-gray-400 hover:text-white text-xs underline transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => refetch?.()}
                >
                    Retry
                </motion.button>
            ),
        },
    };
    const { icon, title, description, action } = content[type];

    return (
        <motion.div
            className="mx-2 my-2 p-4 rounded-xl bg-gray-800/40 flex flex-col gap-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col gap-2">
                {icon}
                <p className="text-white font-bold text-sm">{title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
            </div>
            {action}
        </motion.div>
    );
};