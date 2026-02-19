import { motion } from "motion/react";
import { Link } from "react-router";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import whiteLogo from "@/assets/dialify-white-logo.webp";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { GiPadlock } from "react-icons/gi";

export const ForgotPasswordPage = () => {
    
    const {
        email,
        error,
        handleEmailChange,
        handleSubmit,
        isLoading,
        emailSent
    } = useForgotPassword();

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
                {!emailSent ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Forgot your password?
                            </h1>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                Don't worry, it happens to the best of us. Enter your email address below and we'll send you a secure link to reset your password.
                            </p>
                        </motion.div>
                        <motion.form 
                            onSubmit={handleSubmit}
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
                                    className={`w-full bg-gray-900/50 border ${error ? 'border-red-500' : 'border-gray-700'} text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all ease-in-out duration-200`}
                                />
                                {error && (
                                    <motion.p 
                                        className="text-red-500 text-xs mt-1"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </motion.div>
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full cursor-pointer bg-brand-primary hover:bg-brand-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                                variants={buttonHoverVariants}
                                whileHover={!isLoading ? "hover" : {}}
                                whileTap={!isLoading ? "tap" : {}}
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane />
                                        <span>Send recovery email</span>
                                    </>
                                )}
                            </motion.button>
                        </motion.form>
                        <motion.div 
                            variants={itemVariants}
                            className="mt-6 p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-lg"
                        >
                            <p className="text-gray-300 text-xs md:text-sm text-center flex flex-col md:flex-row justify-center items-center md:items-stretch gap-1">
                                <span className="inline-block text-xl md:text-base">
                                    <GiPadlock />
                                </span>
                                For your security, the recovery link will expire in 10 minutes.
                            </p>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="emailSent"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
                            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full mb-6"
                        >
                            <FaPaperPlane className="text-green-500 text-2xl md:text-3xl" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Check your email
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base mb-2">
                            We've sent a password recovery link to
                        </p>
                        <p className="text-white font-semibold mb-6">
                            {email}
                        </p>
                        <p className="text-gray-500 text-xs md:text-sm mb-8">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <motion.button
                            onClick={() => window.location.reload()}
                            className="text-brand-primary hover:text-brand-primary-light font-semibold underline underline-offset-4 transition-colors cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Try with a different email
                        </motion.button>
                    </motion.div>
                )}
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