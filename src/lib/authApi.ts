import { apiClient } from "./baseApi";
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from "./types";

export const authApi = {
    login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
        return res.data;
    },

    register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
        return res.data;
    },

    refresh: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/refresh', {
            refreshToken,
        });
        return res.data;
    },
};