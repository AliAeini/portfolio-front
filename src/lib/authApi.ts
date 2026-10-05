import { apiClient } from "./baseApi";
import { ApiResponse, AuthResponse, LoginRequest } from "./types";

export const authApi = {
    login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
        return res.data;
    },
};