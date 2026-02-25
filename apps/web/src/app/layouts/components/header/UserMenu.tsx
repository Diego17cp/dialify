import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { UserMenuItem } from "./UserMenuItem"
import { LuLogOut } from "react-icons/lu"
import defaultPfp from "@/assets/default-pfp.webp";
import { FaSignInAlt } from "react-icons/fa";
import { PiUserCircleGearFill } from "react-icons/pi";
import { RiUser3Fill } from "react-icons/ri";
import { useAuth } from "@/features/auth";

export const UserMenu = () => {
    const [isVisible, setIsVisible] = useState(false)
    const toggleMenu = () => setIsVisible(!isVisible)
    const navLinks = [
        {
            to: "/auth/login",
            label: "Log in",
            icon: <FaSignInAlt className="text-xl" />,
        },
        {
            to: "/account",
            label: "View Account",
            icon: <PiUserCircleGearFill className="text-2xl" />,
        },
        {
            to: "/profile",
            label: "Profile",
            icon: <RiUser3Fill className="text-xl" />,
        },
    ];
    const { useLogoutMutation } = useAuth();
    const { mutate: onLogout } = useLogoutMutation;
    
    return (
        <div className="relative">
            <motion.div 
                className="rounded-lg px-3 py-2 cursor-pointer" 
                onClick={toggleMenu}
            >
                <motion.div
                    className="flex items-center justify-center overflow-hidden p-1 size-12 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                >
                    <img src={defaultPfp} alt="Default Profile Picture" className="size-full scale-150 rounded-full object-cover" />
                </motion.div>
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            className="absolute right-0 top-full mt-1 z-30 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2 origin-top-right"
                            initial={{ 
                                opacity: 0, 
                                scale: 0.9, 
                                y: -10,
                                transformOrigin: "top right" 
                            }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: 0 
                            }}
                            exit={{ 
                                opacity: 0, 
                                scale: 0.9, 
                                y: -10,
                                transition: { duration: 0.15 }
                            }}
                            transition={{ 
                                duration: 0.2, 
                                ease: "easeOut" 
                            }}
                        >
                            {navLinks.map((item, index) => {
                                return (
                                    <motion.div 
                                        key={item.to}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ 
                                            delay: index * 0.05,
                                            duration: 0.2 
                                        }}
                                    >
                                        <UserMenuItem
                                            to={item.to}
                                            label={item.label}
                                            icon={item.icon}
                                        />
                                    </motion.div>
                                )
                            })}
                            <motion.hr 
                                className="my-2 border-gray-500"
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ 
                                    delay: navLinks.length * 0.05,
                                    duration: 0.2 
                                }}
                            />
                            <motion.button 
                                className="flex items-center rounded-md px-4 py-2 w-full text-left text-red-500 hover:bg-red-500/30 hover:text-red-300 cursor-pointer transition-all duration-300 ease-in"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ 
                                    delay: (navLinks.length * 0.05) + 0.1,
                                    duration: 0.2 
                                }}
                                whileHover={{ 
                                    scale: 1.02,
                                    transition: { duration: 0.1 }
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onLogout()}
                            >
                                <LuLogOut className="mr-3" />
                                <span>Logout</span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}