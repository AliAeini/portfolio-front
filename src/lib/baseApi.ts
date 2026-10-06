import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from './types';

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
    (response) => {
        const method = response.config.method?.toLowerCase();

        if (method && method !== 'get') {
            const data = response.data as ApiResponse<unknown>;
            if (data?.message) {
                toast.success(data.message);
            }
        }

        return response;
    },
    (error: AxiosError<ApiResponse<unknown>>) => {
        const method = error.config?.method?.toLowerCase();

        if (error.response?.data) {
            const apiErr = error.response.data;

            if (method && method !== 'get') {
                const message = apiErr.errors?.[0] || apiErr.message || 'Something went wrong';
                toast.error(message);
            }

            return Promise.reject(apiErr);
        }

        const networkError: ApiResponse<unknown> = {
            success: false,
            message: 'Network error.',
            data: null,
            errors: [error.message],
            timestamp: new Date().toISOString(),
        };

        if (method && method !== 'get') {
            toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(networkError);
    }
);

export { API_URL };