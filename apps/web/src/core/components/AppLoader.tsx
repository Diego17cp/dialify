import { motion } from "motion/react";
import whiteLogo from "@/assets/dialify-white-logo.webp";

export const AppLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
            <div className="relative flex items-center justify-center">
                <motion.div
                    className="absolute rounded-full border-2 border-accent/30 size-30 md:size-32 lg:size-42"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0.1, 0.4],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute rounded-full border border-accent/20 size-20 md:size-24 lg:size-32"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.05, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                />
                <motion.div
                    className="relative z-10 rounded-full bg-accent/15 p-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <img
                        src={whiteLogo}
                        alt="Dialify"
                        className="h-30 md:h-40 lg:h-50"
                    />
                </motion.div>
            </div>
        </div>
    );
};