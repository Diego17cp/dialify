import { togglePasswordVisibility } from "@/shared/utils";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useLogin = () => {
    const navigate = useNavigate();
    const { useLoginMutation } = useAuth();
    
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        verificationCode?: string;
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
    const validateVerificationCode = (value: string) => {
        if (showVerificationInput && !value) return "Verification code is required";
        if (value && value.length !== 6) return "Code must be 6 digits";
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
    const handleVerificationCodeChange = (value: string) => {
        const cleanValue = value.replace(/\D/g, "").slice(0, 6);
        setVerificationCode(cleanValue);
        const error = validateVerificationCode(cleanValue);
        setErrors(prev => ({ ...prev, verificationCode: error }));
    };

    const togglePassword = () => togglePasswordVisibility(showPassword, setShowPassword);

    const handleNextStep = () => {
        const emailError = validateEmail(email);

        if (emailError) {
            setErrors({ email: emailError });
            return;
        }

        setStep(2);
    };

    const handlePrevStep = () => {
        setStep(1);
        setShowVerificationInput(false);
        setVerificationCode("");
    };

    const handleRequestVerificationCode = () => {
        // TODO: Implementar lógica de envío de código
        setShowVerificationInput(true);
        toast.success("Verification code sent to your email");
    };
    const handleCloseRequestVerification = () => {
        setShowVerificationInput(false);
        setVerificationCode("");
    };

    const handleResendCode = () => {
        // TODO: Implementar lógica de reenvío
        toast.success("Code resent successfully");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordError = validatePassword(password);
        const codeError = validateVerificationCode(verificationCode);

        if (passwordError || codeError) {
            setErrors({ password: passwordError, verificationCode: codeError });
            return;
        }

        const emailError = validateEmail(email);
        if (emailError) {
            setErrors({ email: emailError });
            setStep(1);
            return;
        }

        useLoginMutation.mutate(
            {
                email,
                password,
                // TODO: Enviar código de verificación si está presente
                ...(verificationCode && { verificationCode }),
            },
            {
                onSuccess: () => {
                    toast.success("Welcome back!");
                    navigate("/");
                },
            }
        );
    };

    return {
        step,
        email,
        password,
        verificationCode,
        showPassword,
        showVerificationInput,
        errors,
        isLoading: useLoginMutation.isPending,
        handleEmailChange,
        handlePasswordChange,
        handleVerificationCodeChange,
        togglePassword,
        handleNextStep,
        handlePrevStep,
        handleRequestVerificationCode,
        handleCloseRequestVerification,
        handleResendCode,
        handleSubmit,
    };
};