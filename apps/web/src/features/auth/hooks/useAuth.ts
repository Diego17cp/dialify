import { apiClient } from "@/core/api";
import type { ApiError, User } from "@/core/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const showError = (message: string, res: AxiosResponse) => {
        throw new Error(message || res.data.message || res.data.error || "An error occurred");
    }
    const showApiError = (error: ApiError, defaultMessage: string) => {
        console.error("[API Error]", error);
        let errorMessage = defaultMessage;
        if (error.response?.data?.error) errorMessage = error.response.data.error;
        else if (error.response?.data?.message) errorMessage = error.response.data.message;
        else if (error.message) errorMessage = error.message;
        toast.error(errorMessage);
    }
    const login = async (credentials: { email: string; password: string }): Promise<User> => {
        const res = await apiClient.post("/auth/login", credentials);
        if (!res.data.success || !res.data.data?.user) showError("Login failed", res);
        return res.data.data.user;
    }
    const register = async (data: { email: string; password: string; username?: string; phone?: string }): Promise<User> => {
        const res = await apiClient.post("/auth/register", data);
        if (!res.data.success || !res.data.data?.user) showError("Registration failed", res);
        return res.data.data.user;
    }
    const anonymousLogin = async (): Promise<User> => {
        const res = await apiClient.post("/auth/anonymous");
        if (!res.data.success || !res.data.data?.user) showError("Anonymous login failed", res);
        return res.data.data.user;
    }
    const convertAnonymous = async (data: { email: string; password: string; username?: string; phone?: string }): Promise<User> => {
        const res = await apiClient.post("/auth/convert", data);
        if (!res.data.success || !res.data.data?.user) showError("Conversion failed", res);
        return res.data.data.user;
    }
    const logout = async () => {
        const res = await apiClient.post("/auth/logout");
        if (!res.data.success) showError("Logout failed", res);
    }

    const useLoginMutation = useMutation({
        mutationFn: login,
        onSuccess: (user) => {
            useAuthStore.getState().setUser(user);
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
            navigate("/", { replace: true });
            toast.success("Welcome back!");
        },
        onError: (error: ApiError) => showApiError(error, "Login failed")
    });
    const useRegisterMutation = useMutation({
        mutationFn: register,
        onSuccess: (user) => {
            useAuthStore.getState().setUser(user);
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
            navigate("/", { replace: true });
            toast.success("Account created successfully!");
        },
        onError: (error: ApiError) => showApiError(error, "Registration failed")
    });
    const useAnonymousLoginMutation = useMutation({
        mutationFn: anonymousLogin,
        onSuccess: (user) => {
            useAuthStore.getState().setUser(user);
            localStorage.setItem("isAnonymous", "true");
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
            navigate("/");
            toast.success("Welcome! You're browsing as a guest.");
        },
        onError: (error: ApiError) => showApiError(error, "Anonymous login failed")
    });
    const useConvertAnonymousMutation = useMutation({
        mutationFn: convertAnonymous,
        onSuccess: (user) => {
            useAuthStore.getState().setUser(user);
            localStorage.removeItem("isAnonymous");
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
            navigate("/");
            toast.success("Account converted successfully!");
        },
        onError: (error: ApiError) => showApiError(error, "Conversion failed")
    });
    const useLogoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            useAuthStore.getState().clearAuth();
            queryClient.clear();
            navigate("/auth/login", { replace: true });
            toast.success("Logged out successfully");
        },
        onError: () => {
            useAuthStore.getState().clearAuth();
            queryClient.clear();
            toast.error("Logout failed, but local session cleared");
        },
    });

    return {
        useLoginMutation,
        useRegisterMutation,
        useAnonymousLoginMutation,
        useConvertAnonymousMutation,
        useLogoutMutation,
    }
}