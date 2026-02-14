import { apiClient } from "./apliClient";
import { useAuthStore } from "@/features/auth";

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error);
		else prom.resolve();
	});
	failedQueue = [];
};
export const setupAuthInterceptor = () => {
	apiClient.interceptors.response.use(
		(response) => response,
		async (err) => {
			const originalRequest = err.config;
			if (
				err.response?.status === 401 &&
				!originalRequest._retry &&
				!originalRequest.url?.includes("/auth/refresh") &&
				!originalRequest.url?.includes("/auth/login")
			) {
				if (isRefreshing) {
					return new Promise((resolve, reject) => {
						failedQueue.push({ resolve, reject });
					})
						.then(() => apiClient(originalRequest))
						.catch((error) => Promise.reject(error));
				}
                originalRequest._retry = true;
                isRefreshing = true;
                try {
                    await apiClient.get("/auth/refresh");
                    processQueue(null);
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    processQueue(new Error("Token refresh failed"));
                    useAuthStore.getState().clearAuth();
                    window.location.href = "/auth/login";
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
			}
            return Promise.reject(err);
		},
	);
};
