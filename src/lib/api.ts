import type { Profile, CreateProfileRequest, UpdateProfileRequest } from './types';

import axios, { AxiosError } from 'axios';
import type { ApiResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5082';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
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

    delete: async (id: string): Promise<ApiResponse<object>> => {
        const res = await apiClient.delete<ApiResponse<object>>(`/api/profiles/${id}`);
        return res.data;
    },
};