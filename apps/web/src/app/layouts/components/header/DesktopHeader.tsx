import { Link } from "react-router";
import { FaHome, FaSearch } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";
import whiteLogo from "@/assets/dialify-white-logo.webp";
import type { useHeader } from "../../hooks/useHeader";
import { useAuthStore } from "@/features/auth";
import { UserMenu } from "./UserMenu";
import { useSearchDropdown } from "../../hooks/useSearchDropdown";
import { DesktopResults } from "./DesktopResults";

type DesktopHeaderProps = ReturnType<typeof useHeader>;

export const DesktopHeader = ({
	isSearchOpen,
	isLg,
	searchQuery,
	searchInputRef,
	toggleSearch,
	handleSearchChange,
	handleSearchSubmit,
}: DesktopHeaderProps) => {
	const { isAuthenticated } = useAuthStore();
	const isAnonymous =	localStorage.getItem("isAnonymous") === "true";
	const searchDropdown = useSearchDropdown(searchQuery, searchInputRef);
	return (
		<header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3 bg-black/90 backdrop-blur-md border-b border-gray-800/50 w-full">
			<div className="flex items-center gap-4">
				<Link to="/">
					<img src={whiteLogo} alt="Dialify" className="h-15" />
				</Link>
				<Link to="/">
					<motion.div
						className="flex items-center justify-center size-12 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
						whileHover={{ scale: 1.08 }}
						whileTap={{ scale: 0.92 }}
					>
						<FaHome className="text-2xl" />
					</motion.div>
				</Link>
				<AnimatePresence mode="wait">
					{isSearchOpen ? (
                        <motion.div
                            key="search-open"
                            className="relative flex items-center"
                            initial={!isLg ? { opacity: 0, width: 0 } : false}
                            animate={{ opacity: 1, width: isLg ? "auto" : "260px" }}
                            exit={!isLg ? { opacity: 0, width: 0 } : undefined}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                                <motion.button
                                    type="button"
                                    onClick={toggleSearch}
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 transition-colors ${!isLg ? "hover:text-white cursor-pointer" : "pointer-events-none"}`}
                                    whileHover={!isLg ? { scale: 1.1 } : {}}
                                    whileTap={!isLg ? { scale: 0.9 } : {}}
                                >
                                    <FaSearch className="text-base" />
                                </motion.button>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={searchDropdown.openDropdown}
                                    placeholder="Artists, songs, podcasts..."
                                    className="bg-gray-800 text-white placeholder-gray-500 rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all w-64 lg:w-72 xl:w-96"
                                />
                            </form>
                            <DesktopResults {...searchDropdown} />
                        </motion.div>
                    ) : (
                        <motion.button
                            key="search-closed"
                            type="button"
                            onClick={toggleSearch}
                            className="flex items-center justify-center size-12 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                        >
                            <FaSearch className="text-xl" />
                        </motion.button>
                    )}
                </AnimatePresence>
			</div>
			<div className="flex items-center gap-3">
				{(!isAuthenticated || isAnonymous) && (
					<Link to="/register">
						<motion.button
							className="cursor-pointer text-gray-300 hover:text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors duration-200"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							Sign up
						</motion.button>
					</Link>
				)}
				{!isAuthenticated ? (
					<Link to="/auth/login">
						<motion.button
							className="cursor-pointer bg-white hover:bg-gray-200 text-black font-bold text-sm px-6 py-2.5 rounded-full transition-colors duration-200 shadow-md"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							Log in
						</motion.button>
					</Link>
				) : (
					<UserMenu />
				)}
			</div>
		</header>
	);
};
