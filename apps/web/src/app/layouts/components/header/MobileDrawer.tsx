import { Link } from "react-router";
import { FaTimes, FaUserPlus, FaSignInAlt, FaBug, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { MdMailOutline } from "react-icons/md";
import { PiUserCircleGearFill } from "react-icons/pi";
import { RiUser3Fill } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";
import { AnimatePresence, motion } from "motion/react";
import whiteLogo from "@/assets/dialify-white-logo.webp";
import { useAuth, useAuthStore } from "@/features/auth";
import { EXTERNAL_LINKS } from "@/core/constants/links";

type MobileDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

const isAuthenticated = useAuthStore.getState().isAuthenticated;

const navLinks = [
    { to: "/", label: "Home", icon: <AiFillHome /> },
    {
        to: "/auth/register",
        label: "Sign up",
        icon: <FaUserPlus />,
        show:
            !localStorage.getItem("isAnonymous") ||
            localStorage.getItem("isAnonymous") === "false",
    },
    {
        to: "/auth/login",
        label: "Log in",
        icon: <FaSignInAlt />,
        show: !isAuthenticated,
    },
    {
        to: "/account",
        label: "View Account",
        icon: <PiUserCircleGearFill />,
        show: isAuthenticated,
    },
    {
        to: "/profile",
        label: "Profile",
        icon: <RiUser3Fill />,
        show: isAuthenticated,
    },
];

const externalLinks = [
    {
        href: EXTERNAL_LINKS.github_repo,
        label: "GitHub Repo",
        icon: <FaGithub />,
        description: "View source code",
    },
    {
        href: EXTERNAL_LINKS.github_issues,
        label: "Report a Bug",
        icon: <FaBug />,
        description: "Report issues",
    },
    {
        href: `mailto:${EXTERNAL_LINKS.dev_email}`,
        label: "Contact",
        icon: <MdMailOutline />,
        description: "Contact developer",
    },
];

export const MobileDrawer = ({ isOpen, onClose }: MobileDrawerProps) => {
    const currentYear = new Date().getFullYear();

    const { useLogoutMutation } = useAuth();
    const { mutate: handleLogout } = useLogoutMutation;
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="overlay"
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />
                    <motion.aside
                        key="drawer"
                        className="fixed top-0 right-0 z-50 h-full w-72 bg-gray-950 border-l border-gray-800 flex flex-col"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                            <img src={whiteLogo} alt="Dialify" className="h-10" />
                            <motion.button
                                onClick={onClose}
                                className="cursor-pointer text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaTimes className="text-lg" />
                            </motion.button>
                        </div>
                        <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
                            {navLinks.map((link, index) => {
                                if (link.show === false) return null;
                                return (
                                    <motion.div
                                        key={link.to}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.07, duration: 0.3 }}
                                    >
                                        <Link
                                            to={link.to}
                                            className="flex items-center gap-4 text-gray-300 hover:text-white hover:bg-gray-800/70 px-4 py-3 rounded-xl font-medium transition-all duration-200"
                                        >
                                            <span className="text-2xl text-gray-400">{link.icon}</span>
                                            <span>{link.label}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                            {isAuthenticated && (
                                <motion.div
                                    key="logout"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navLinks.length * 0.07, duration: 0.3 }}
                                >
                                    <button
                                        onClick={() => handleLogout()}
                                        className="flex items-center gap-4 text-red-300 hover:text-red-400 cursor-pointer hover:bg-gray-800/70 px-4 py-3 rounded-xl font-medium transition-all duration-200 w-full text-left"
                                    >
                                        <span className="text-2xl text-red-400">
                                            <FaSignOutAlt />
                                        </span>
                                        <span>Logout</span>
                                    </button>
                                </motion.div>
                            )}
                        </nav>
                        <footer className="px-5 py-5 border-t border-gray-800 space-y-4">
                            <div>
                                <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-3 px-1">
                                    More
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {externalLinks.map((link, index) => (
                                        <motion.a
                                            key={link.href}
                                            href={link.href}
                                            target={link.href.startsWith("mailto") ? undefined : "_blank"}
                                            rel="noopener noreferrer"
                                            title={link.label}
                                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.07, duration: 0.3 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="text-xl">{link.icon}</span>
                                            <span className="text-xs text-gray-500 text-center leading-tight">
                                                {link.description}
                                            </span>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1 pt-1">
                                <p className="text-gray-500 text-xs text-center">
                                    © {currentYear} Dialify
                                </p>
                                <p className="text-gray-500 text-xs text-center flex items-center justify-center gap-1">
                                    Made with
                                    <motion.span
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                        className="inline-flex text-red-500"
                                    >
                                        <FaHeart className="text-xs" />
                                    </motion.span>
                                    by Dialcadev
                                </p>
                            </div>
                        </footer>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};
