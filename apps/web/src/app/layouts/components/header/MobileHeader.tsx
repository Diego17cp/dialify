import { Link } from "react-router";
import { FaBars, FaDownload } from "react-icons/fa";
import { motion } from "motion/react";
import whiteLogo from "@/assets/dialify-white-logo.webp";
import { MobileDrawer } from "./MobileDrawer";
import type { useHeader } from "../../hooks/useHeader";

type MobileHeaderProps = Pick<
    ReturnType<typeof useHeader>,
    "isDrawerOpen" | "toggleDrawer" | "closeDrawer"
>;

export const MobileHeader = ({ isDrawerOpen, toggleDrawer, closeDrawer }: MobileHeaderProps) => {
    const handleInstall = () => {
        // TODO: Implementar lógica PWA install prompt
    };

    return (
        <>
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-black/90 backdrop-blur-md border-b border-gray-800/50 w-full">
                <Link to="/">
                    <img
                        src={whiteLogo}
                        alt="Dialify"
                        className="h-15"
                    />
                </Link>
                <div className="flex items-center gap-2">
                    <motion.button
                        onClick={handleInstall}
                        className="cursor-pointer flex items-center gap-2 text-sm text-gray-300 hover:text-white font-semibold px-3 py-2 rounded-full border border-gray-700 hover:border-gray-500 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FaDownload className="text-sm" />
                        <span>Install app</span>
                    </motion.button>
                    <motion.button
                        onClick={toggleDrawer}
                        className="cursor-pointer text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaBars className="text-xl" />
                    </motion.button>
                </div>
            </header>
            <MobileDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
        </>
    );
};