import { create } from "zustand";


import type { AuthStore, User } from "@/types/auth";
import { createApiRequest } from "@/api/api";
import { handleApiError } from "@/utils/errorHandler";

export const useAuthStore = create<AuthStore>()(

    (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        login: async ({ email, password }) => {
            set({ loading: true, error: null });

            try {
                const response = await createApiRequest('admin/login', {
                    email,
                    password,
                });
                const res_ = response?.data?.data ?? response?.data;

                if (response?.data?.status && response?.data?.data?.accessToken) {
                    const { user, accessToken } = res_;
                    localStorage.setItem('authToken', accessToken)
                    set({
                        user,
                        accessToken,
                        isAuthenticated: true,
                        loading: false,
                        error: null,
                    });

                    return {
                        success: true,
                        message: response.data?.message,
                    };
                }

                const message =
                    response?.data?.message || "Invalid email or password.";

                set({ loading: false, error: message });

                return { success: false, message };
            } catch (err: any) {
                const message = handleApiError(err ?? err?.data, "Something went wrong. Please try again.");

                set({ loading: false, error: message });

                return { success: false, message };
            }
        },

        forgotPassword: async (email) => {
            set({ loading: true, error: null });

            try {
                const response = await createApiRequest("auth/forgot-password", { email, });

                if (response?.data?.status) {
                    set({
                        loading: false,
                        error: null,
                    });
                    return { success: true, message: response?.data?.message, };
                }

                const message =
                    response?.data?.message || "Failed to send reset password email.";

                set({ loading: false, error: message, });

                return { success: false, message, };
            } catch (err: any) {
                const message = handleApiError(err, "Something went wrong. Please try again.");
                set({
                    loading: false,
                    error: message,
                });

                return { success: false, message, };
            }
        },

        logout: () => {
            localStorage.clear();

            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                error: null,
            });
        },

        clearError: () => set({ error: null }),

        setUser: (user: User) => set({ user }),

        refreshToken: async () => {
            try {
                const response = await createApiRequest(
                    "auth/refreshToken",
                    {}
                );
                const resData = response?.data?.data ?? response?.data;

                if (
                    response?.data?.status &&
                    resData?.accessToken
                ) {
                    const {
                        user,
                        accessToken
                    } = resData;

                    localStorage.setItem("authToken", accessToken);
                    set({
                        user,
                        accessToken,
                        isAuthenticated: true,
                        error: null
                    });
                    return true;
                }
                return false;

            } catch (error: any) {
                const message = handleApiError(error, "Failed to refresh token");
                set({
                    error: message,
                    user: null,
                    accessToken: null,
                    isAuthenticated: false
                });

                localStorage.removeItem("authToken");
                return false;
            }
        },
    }),
);