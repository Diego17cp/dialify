import { apiClient } from "@/core/api";
import type { ApiError } from "@/core/types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | undefined>();

    const validateEmail = (value: string) => {
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email address";
        return undefined;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        const validationError = validateEmail(value);
        setError(validationError);
    };

    const canSubmit = !error && email;

    const sendResetLink = async () => {
        const response = await apiClient.post("/auth/forgot-password", { email });
        return response.data;
    };
    
    const resetLinkMutation = useMutation({
        mutationFn: sendResetLink,
        onSuccess: () => {
            toast.success("If an account with that email exists, a reset link has been sent.");
            setEmail("");
            setError(undefined);
        },
        onError: (err: ApiError) => {
            let message = "An error occurred. Please try again.";
            if (err.response?.data?.message) message = err.response.data.message;
            if (err.response?.status === 400) message = "Please enter a valid email address.";
            if (err.message) message = err.message;
            toast.error(message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) {
            setError(validateEmail(email));
            return;
        }
        resetLinkMutation.mutate();
    }

    return {
        email,
        error,
        handleEmailChange,
        handleSubmit,
        isLoading: resetLinkMutation.isPending,
        emailSent: resetLinkMutation.isSuccess
    }
}