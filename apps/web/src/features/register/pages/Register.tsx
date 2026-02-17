import { Link, Navigate } from "react-router";
import { FaGithub, FaGoogle, FaEye, FaEyeSlash, FaArrowLeft, FaUserSecret } from "react-icons/fa";
import whiteLogo from "@/assets/dialify-white-logo.webp";
import { toast } from "sonner";
import { useRegister } from "../hooks/useRegister";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "@/features/auth";

export const RegisterPage = () => {
    const {
        step,
        email,
        password,
        username,
        phone,
        showPassword,
        errors,
        isLoading,
        handleEmailChange,
        handlePasswordChange,
        handleUsernameChange,
        handlePhoneChange,
        togglePassword,
        handleNextStep,
        handlePrevStep,
        handleSubmit,
        handleAnonymousLogin,
        isAnonymousLoading
    } = useRegister();

    const { isAuthenticated } = useAuthStore();
    if (isAuthenticated && !localStorage.getItem("isAnonymous")) return <Navigate to="/" replace />

    const handleGoogleSignUp = () => toast.info("Google sign-up is not implemented yet.");
    const handleGithubSignUp = () => toast.info("GitHub sign-up is not implemented yet.");

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
                <div className="text-center mb-8 relative">
                    <AnimatePresence>
                        {step === 2 && (
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onClick={handlePrevStep}
                                className="absolute cursor-pointer left-0 top-0 text-gray-400 hover:text-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaArrowLeft className="text-xl" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-center gap-2 mb-4">
                        <motion.div 
                            className={`h-1 w-12 rounded-full`}
                            animate={{ 
                                backgroundColor: step === 1 ? 'rgb(8, 86, 145)' : 'rgb(55, 65, 81)'
                            }}
                            transition={{ duration: 0.3 }}
                        />
                        <motion.div 
                            className={`h-1 w-12 rounded-full`}
                            animate={{ 
                                backgroundColor: step === 2 ? 'rgb(8, 86, 145)' : 'rgb(55, 65, 81)'
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <motion.h1 
                        className="text-3xl md:text-4xl font-bold text-white mb-2"
                        key={`title-${step}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {step === 1 ? "Sign up to start" : "Tell us about you"}
                    </motion.h1>
                    <motion.p 
                        className="text-gray-400 text-sm md:text-base"
                        key={`subtitle-${step}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        {step === 1 ? "listening for free" : "Step 2 of 2"}
                    </motion.p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.div variants={itemVariants} className="space-y-3 mb-6">
                                <motion.button
                                    onClick={handleGoogleSignUp}
                                    className="w-full cursor-pointer flex items-center justify-center gap-3 bg-transparent border border-gray-700 hover:border-gray-600 text-white font-medium py-3 px-4 rounded-full transition-colors duration-200"
                                    variants={buttonHoverVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <FaGoogle className="text-xl" />
                                    <span>Sign up with Google</span>
                                </motion.button>

                                <motion.button
                                    onClick={handleGithubSignUp}
                                    className="w-full cursor-pointer flex items-center justify-center gap-3 bg-transparent border border-gray-700 hover:border-gray-600 text-white font-medium py-3 px-4 rounded-full transition-colors duration-200"
                                    variants={buttonHoverVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <FaGithub className="text-xl" />
                                    <span>Sign up with GitHub</span>
                                </motion.button>
                            </motion.div>

                            <motion.div variants={itemVariants} className="mb-6">
                                <motion.button
                                    onClick={handleAnonymousLogin}
                                    disabled={isAnonymousLoading}
                                    className="w-full cursor-pointer flex items-center justify-center gap-3 bg-linear-to-r from-accent-light to-accent hover:from-accent hover:to-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-full transition-colors duration-200 shadow-lg shadow-accent/20"
                                    variants={buttonHoverVariants}
                                    whileHover={!isAnonymousLoading ? "hover" : {}}
                                    whileTap={!isAnonymousLoading ? "tap" : {}}
                                >
                                    <FaUserSecret className="text-xl" />
                                    <span>{isAnonymousLoading ? "Starting..." : "Continue as Guest"}</span>
                                </motion.button>
                                <motion.p 
                                    className="text-gray-500 text-xs text-center mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    No email required • You can upgrade later
                                </motion.p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-800"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-gray-900/50 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                                        or use email
                                    </span>
                                </div>
                            </motion.div>

                            <motion.form 
                                onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}
                                className="space-y-6"
                                variants={itemVariants}
                            >
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="email" className="block text-white font-semibold mb-2 text-sm">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="your@email.com"
                                        className={`w-full bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ease-in-out duration-200`}
                                    />
                                    <AnimatePresence>
                                        {errors.email && (
                                            <motion.p 
                                                className="text-red-500 text-xs mt-1"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.email}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label htmlFor="password" className="block text-white font-semibold mb-2 text-sm">
                                        Password
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

                                <motion.button
                                    type="submit"
                                    className="w-full cursor-pointer bg-brand-primary hover:bg-brand-primary-light text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg shadow-brand-primary/20"
                                    variants={buttonHoverVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Next
                                </motion.button>
                            </motion.form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.form onSubmit={handleSubmit} className="space-y-6">
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="username" className="block text-white font-semibold mb-2 text-sm">
                                        Username <span className="text-gray-500 text-xs font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={handleUsernameChange}
                                        placeholder="How should we call you?"
                                        className="w-full bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ease-in-out duration-200"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label htmlFor="phone" className="block text-white font-semibold mb-2 text-sm">
                                        Phone number <span className="text-gray-500 text-xs font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="+1 234 567 8900"
                                        className={`w-full bg-gray-900/50 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ease-in-out duration-200`}
                                    />
                                    <AnimatePresence>
                                        {errors.phone && (
                                            <motion.p 
                                                className="text-red-500 text-xs mt-1"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.phone}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full cursor-pointer bg-brand-primary hover:bg-brand-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg shadow-brand-primary/20"
                                    variants={buttonHoverVariants}
                                    whileHover={!isLoading ? "hover" : {}}
                                    whileTap={!isLoading ? "tap" : {}}
                                >
                                    {isLoading ? "Creating account..." : "Create account"}
                                </motion.button>
                            </motion.form>
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
                    <p className="text-gray-400 text-sm mb-2">Already have an account?</p>
                    <Link
                        to="/auth/login"
                        className="inline-block text-white font-semibold hover:text-brand-primary-light underline underline-offset-4 decoration-2 transition-colors"
                    >
                        Log in here
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
                    By signing up, you agree to our{" "}
                    <a href="#" className="underline hover:text-gray-400">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-gray-400">
                        Privacy Policy
                    </a>
                </p>
            </motion.div>
        </div>
    );
};