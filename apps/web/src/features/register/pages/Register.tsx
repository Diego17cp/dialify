import { Link } from "react-router";
import { FaGithub, FaGoogle, FaEye, FaEyeSlash, FaArrowLeft, FaUserSecret } from "react-icons/fa";
import whiteLogo from "@/assets/dialify-white-logo.webp";
import { toast } from "sonner";
import { useRegister } from "../hooks/useRegister";

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

    const handleGoogleSignUp = () => toast.info("Google sign-up is not implemented yet.");
    const handleGithubSignUp = () => toast.info("GitHub sign-up is not implemented yet.");

    return (
        <div className="min-h-screen bg-linear-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md mb-2">
                <img src={whiteLogo} alt="Dialify" className="h-25 mx-auto" />
            </div>

            <div className="w-full max-w-md backdrop-blur-sm rounded-2xl p-8 md:p-10 pt-0 md:pt-0">
                <div className="text-center mb-8">
                    {step === 2 && (
                        <button
                            onClick={handlePrevStep}
                            className="absolute left-8 top-8 text-gray-400 hover:text-white transition-colors"
                        >
                            <FaArrowLeft className="text-xl" />
                        </button>
                    )}
                    <div className="flex justify-center gap-2 mb-4">
                        <div className={`h-1 w-12 rounded-full transition-all ${step === 1 ? 'bg-brand-primary' : 'bg-gray-700'}`} />
                        <div className={`h-1 w-12 rounded-full transition-all ${step === 2 ? 'bg-brand-primary' : 'bg-gray-700'}`} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {step === 1 ? "Sign up to start" : "Tell us about you"}
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        {step === 1 ? "listening for free" : "Step 2 of 2"}
                    </p>
                </div>

                {step === 1 && (
                    <>
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={handleGoogleSignUp}
                                className="w-full cursor-pointer flex items-center justify-center gap-3 bg-transparent border border-gray-700 hover:border-gray-600 text-white font-medium py-3 px-4 rounded-full transition-all duration-200 hover:scale-[1.02]"
                            >
                                <FaGoogle className="text-xl" />
                                <span>Sign up with Google</span>
                            </button>

                            <button
                                onClick={handleGithubSignUp}
                                className="w-full cursor-pointer flex items-center justify-center gap-3 bg-transparent border border-gray-700 hover:border-gray-600 text-white font-medium py-3 px-4 rounded-full transition-all duration-200 hover:scale-[1.02]"
                            >
                                <FaGithub className="text-xl" />
                                <span>Sign up with GitHub</span>
                            </button>
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={handleAnonymousLogin}
                                disabled={isAnonymousLoading}
                                className="w-full cursor-pointer flex items-center justify-center gap-3 bg-linear-to-r from-accent-light to-accent hover:from-accent hover:to-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-full transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-accent/20"
                            >
                                <FaUserSecret className="text-xl" />
                                <span>{isAnonymousLoading ? "Starting..." : "Continue as Guest"}</span>
                            </button>
                            <p className="text-gray-500 text-xs text-center mt-2">
                                No email required • You can upgrade later
                            </p>
                        </div>
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gray-900/50 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                                    or use email
                                </span>
                            </div>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-6">
                            <div>
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
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
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
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full cursor-pointer bg-brand-primary hover:bg-brand-primary-light text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-brand-primary/20"
                            >
                                Next
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        {/* Step 2: Username y Phone */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
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
                            </div>

                            <div>
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
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full cursor-pointer bg-brand-primary hover:bg-brand-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-brand-primary/20"
                            >
                                {isLoading ? "Creating account..." : "Create account"}
                            </button>
                        </form>
                    </>
                )}

                <hr className="my-8 border-t border-gray-800" />

                <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Already have an account?</p>
                    <Link
                        to="/auth/login"
                        className="inline-block text-white font-semibold hover:text-brand-primary-light underline underline-offset-4 decoration-2 transition-colors"
                    >
                        Log in here
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-center text-gray-500 text-xs">
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
            </div>
        </div>
    );
};