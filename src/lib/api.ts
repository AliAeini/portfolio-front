import axios, { AxiosError } from 'axios';
import type {
    ApiResponse,
    Profile,
    CreateProfileRequest,
    UpdateProfileRequest,
    UpdateAvatarRequest,
    UploadResponse,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiResponse<unknown>>) => {
        if (error.response?.data) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject({
            success: false,
            message: 'Network error. Please check your connection.',
            data: null,
            errors: [error.message],
            timestamp: new Date().toISOString(),
        } as ApiResponse<unknown>);
    }
);

export const profileApi = {
    getAll: async (): Promise<ApiResponse<Profile[]>> => {
        const res = await apiClient.get<ApiResponse<Profile[]>>('/api/profiles');
        return res.data;
    },

    getById: async (id: string): Promise<ApiResponse<Profile>> => {
        const res = await apiClient.get<ApiResponse<Profile>>(`/api/profiles/${id}`);
        return res.data;
    },

    create: async (data: CreateProfileRequest): Promise<ApiResponse<Profile>> => {
        const res = await apiClient.post<ApiResponse<Profile>>('/api/profiles', data);
        return res.data;
    },

    update: async (id: string, data: UpdateProfileRequest): Promise<ApiResponse<Profile>> => {
        const res = await apiClient.put<ApiResponse<Profile>>(`/api/profiles/${id}`, data);
        return res.data;
    },

    updateAvatar: async (id: string, data: UpdateAvatarRequest): Promise<ApiResponse<Profile>> => {
        const res = await apiClient.patch<ApiResponse<Profile>>(`/api/profiles/${id}/avatar`, data);
        return res.data;
    },

    delete: async (id: string): Promise<ApiResponse<object>> => {
        const res = await apiClient.delete<ApiResponse<object>>(`/api/profiles/${id}`);
        return res.data;
    },
};

export const uploadApi = {
    uploadAvatar: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await apiClient.post<UploadResponse>('/api/upload/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data;
    },
};

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
}

export const authApi = {
    login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
        return res.data;
    },
};

export { API_URL };