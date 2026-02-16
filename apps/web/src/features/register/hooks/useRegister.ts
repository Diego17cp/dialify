import { togglePasswordVisibility } from "@/shared/utils";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useRegister = () => {
    const navigate = useNavigate();
    const { useRegisterMutation, useAnonymousLoginMutation, useConvertAnonymousMutation } = useAuth();
    
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        username?: string;
        phone?: string;
    }>({});

    const validateEmail = (value: string) => {
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email address";
        return undefined;
    };
    const validatePassword = (value: string) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return undefined;
    };
    const validatePhone = (value: string) => {
        if (!value) return undefined;
        if (!/^\+?[\d\s-()]+$/.test(value)) return "Please enter a valid phone number";
        return undefined;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        const error = validateEmail(value);
        setErrors(prev => ({ ...prev, email: error }));
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        const error = validatePassword(value);
        setErrors(prev => ({ ...prev, password: error }));
    };
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
    };
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value);
        const error = validatePhone(value);
        setErrors(prev => ({ ...prev, phone: error }));
    };
    const togglePassword = () => togglePasswordVisibility(showPassword, setShowPassword);

    const handleNextStep = () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }

        setStep(2);
    };

    const handlePrevStep = () => setStep(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const phoneError = validatePhone(phone);
        if (phoneError) {
            setErrors(prev => ({ ...prev, phone: phoneError }));
            return;
        }

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            setStep(1);
            return;
        }

        if (localStorage.getItem("isAnonymous") === "true") {
            useConvertAnonymousMutation.mutate(
                {
                    email,
                    password,
                    ...(username && { username }),
                    ...(phone && { phone }),
                },
                {
                    onSuccess: () => {
                        toast.success("Account created successfully!");
                        navigate("/");
                    }
                }
            )
        } else {
            useRegisterMutation.mutate(
                {
                    email,
                    password,
                    ...(username && { username }),
                    ...(phone && { phone }),
                },
                {
                    onSuccess: () => {
                        toast.success("Account created successfully!");
                        navigate("/");
                    },
                }
            );
        }

    };

    const handleAnonymousLogin = () => {
        useAnonymousLoginMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Welcome! You're browsing as a guest.");
                navigate("/");
            },
            onError: () => {
                toast.error("Failed to create anonymous session");
            }
        });
    }

    return {
        step,
        email,
        password,
        username,
        phone,
        showPassword,
        errors,
        isLoading: useRegisterMutation.isPending,
        handleEmailChange,
        handlePasswordChange,
        handleUsernameChange,
        handlePhoneChange,
        togglePassword,
        handleNextStep,
        handlePrevStep,
        handleSubmit,
        handleAnonymousLogin,
        isAnonymousLoading: useAnonymousLoginMutation.isPending,
    };
};