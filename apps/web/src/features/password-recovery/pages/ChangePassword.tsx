import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import whiteLogo from "@/assets/dialify-white-logo.webp";
import { useResetPassword } from "../hooks/useResetPassword";

export const ChangePasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const {
        password,
        confirmPassword,
        showPassword,
        showConfirmPassword,
        errors,
        isLoading,
        passwordReset,
        handlePasswordChange,
        handleConfirmPasswordChange,
        togglePassword,
        toggleConfirmPassword,
        handleSubmit,
    } = useResetPassword(token);

    if (!token) {
        navigate("/auth/forgot-password");
        return null;
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                ease: "easeOut" as const,
                staggerChildren: 0.1
            }
        },
        exit: { 
            opacity: 0, 
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" as const }
        }
    };

    const buttonHoverVariants = {
        hover: { scale: 1.02, transition: { duration: 0.2 } },
        tap: { scale: 0.98 }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center px-4 py-8">
            <motion.div 
                className="w-full max-w-md mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <img src={whiteLogo} alt="Dialify" className="h-25 mx-auto" />
            </motion.div>
            <motion.div 
                className="w-full max-w-md backdrop-blur-sm rounded-2xl p-8 md:p-10 pt-0 md:pt-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
                <div className="relative mb-8">
                    <Link to="/auth/login">
                        <motion.button
                            className="absolute cursor-pointer left-0 top-0 text-gray-400 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaArrowLeft className="text-xl" />
                        </motion.button>
                    </Link>
                </div>
                <AnimatePresence mode="wait">
                    {!passwordReset ? (
                        <motion.div
                            key="form"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.div variants={itemVariants} className="text-center mb-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Reset your password
                                </h1>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                    Choose a strong password to keep your account secure.
                                </p>
                            </motion.div>
                            <motion.form 
                                onSubmit={handleSubmit}
                                className="space-y-6"
                                variants={itemVariants}
                            >
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="password" className="block text-white font-semibold mb-2 text-sm">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            placeholder="At least 8 characters"
                                            className={`w-full bg-gray-900/50 border ${errors.password ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-500 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ease-in-out duration-200`}
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={togglePassword}
                                            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </motion.button>
                                    </div>
                                    <AnimatePresence>
                                        {errors.password && (
                                            <motion.p 
                                                className="text-red-500 text-xs mt-1"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.password}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="confirmPassword" className="block text-white font-semibold mb-2 text-sm">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            placeholder="Repeat your password"
                                            className={`w-full bg-gray-900/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-500 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ease-in-out duration-200`}
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={toggleConfirmPassword}
                                            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </motion.button>
                                    </div>
                                    <AnimatePresence>
                                        {errors.confirmPassword && (
                                            <motion.p 
                                                className="text-red-500 text-xs mt-1"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.confirmPassword}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                <motion.div 
                                    variants={itemVariants}
                                    className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg"
                                >
                                    <p className="text-gray-400 text-xs mb-2 font-semibold">Password requirements:</p>
                                    <ul className="space-y-1">
                                        <li className={`text-xs flex items-center gap-2 ${password.length >= 8 ? 'text-green-500' : 'text-gray-500'}`}>
                                            <span className="text-xs">•</span> At least 8 characters
                                        </li>
                                        <li className={`text-xs flex items-center gap-2 ${password && confirmPassword && password === confirmPassword ? 'text-green-500' : 'text-gray-500'}`}>
                                            <span className="text-xs">•</span> Passwords match
                                        </li>
                                    </ul>
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full cursor-pointer bg-brand-primary hover:bg-brand-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg shadow-brand-primary/20"
                                    variants={buttonHoverVariants}
                                    whileHover={!isLoading ? "hover" : {}}
                                    whileTap={!isLoading ? "tap" : {}}
                                >
                                    {isLoading ? "Resetting password..." : "Reset password"}
                                </motion.button>
                            </motion.form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
                                className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full mb-6"
                            >
                                <FaCheckCircle className="text-green-500 text-2xl md:text-3xl" />
                            </motion.div>

                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Password reset successfully!
                            </h2>
                            
                            <p className="text-gray-400 text-sm md:text-base mb-8">
                                Your password has been changed. You can now log in with your new password.
                            </p>

                            <Link to="/auth/login">
                                <motion.button
                                    className="w-full cursor-pointer bg-brand-primary hover:bg-brand-primary-light text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg shadow-brand-primary/20"
                                    variants={buttonHoverVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Go to login
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.hr 
                    className="my-8 border-t border-gray-800"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                />
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                >
                    <p className="text-gray-400 text-sm mb-2">
                        Remember your password?
                    </p>
                    <Link
                        to="/auth/login"
                        className="inline-block text-white font-semibold hover:text-brand-primary-light underline underline-offset-4 decoration-2 transition-colors"
                    >
                        Back to login
                    </Link>
                </motion.div>
            </motion.div>
            <motion.div 
                className="mt-8 text-center text-gray-500 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <p>
                    Need help?{" "}
                    <a href="#" className="underline hover:text-gray-400">
                        Contact support
                    </a>
                </p>
            </motion.div>
        </div>
    );
};