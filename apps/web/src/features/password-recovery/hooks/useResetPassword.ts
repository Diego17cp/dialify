import { togglePasswordVisibility } from "@/shared/utils";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/core/api";
import { toast } from "sonner";
import type { ApiError } from "@/core/types";

export const useResetPassword = (token: string | null) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{
        password?: string;
        confirmPassword?: string;
    }>({});
    const validatePassword = (value: string) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return undefined;
    };
    const validateConfirmPassword = (value: string) => {
        if (!value) return "Please confirm your password";
        if (value !== password) return "Passwords do not match";
        return undefined;
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        const error = validatePassword(value);
        setErrors(prev => ({ ...prev, password: error }));

        if (confirmPassword) {
            const confirmError = value !== confirmPassword ? "Passwords do not match" : undefined;
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        const error = validateConfirmPassword(value);
        setErrors(prev => ({ ...prev, confirmPassword: error }));
    };

    const togglePassword = () => togglePasswordVisibility(showPassword, setShowPassword);
    const toggleConfirmPassword = () => togglePasswordVisibility(showConfirmPassword, setShowConfirmPassword);

    const resetPassword = async () => {
        const response = await apiClient.post("/auth/reset-password", {
            token,
            newPassword: password
        });
        return response.data;
    };

    const resetPasswordMutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success("Password reset successfully!");
        },
        onError: (err: ApiError) => {
            let message = "Failed to reset password. Please try again.";
            if (err.response?.data?.message) message = err.response.data.message;
            if (err.response?.status === 400) message = "Invalid or expired reset link.";
            if (err.message) message = err.message;
            toast.error(message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const passwordError = validatePassword(password);
        const confirmError = validateConfirmPassword(confirmPassword);

        if (passwordError || confirmError) {
            setErrors({ password: passwordError, confirmPassword: confirmError });
            return;
        }

        resetPasswordMutation.mutate();
    };

    return {
        password,
        confirmPassword,
        showPassword,
        showConfirmPassword,
        errors,
        isLoading: resetPasswordMutation.isPending,
        passwordReset: resetPasswordMutation.isSuccess,
        handlePasswordChange,
        handleConfirmPasswordChange,
        togglePassword,
        toggleConfirmPassword,
        handleSubmit,
    };
};