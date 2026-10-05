import axios, { AxiosError } from 'axios';
import type { ApiResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5082';

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
            message: 'Network error.',
            data: null,
            errors: [error.message],
            timestamp: new Date().toISOString(),
        } as ApiResponse<unknown>);
    }
);


export { API_URL };