import { apiClient } from "./baseApi";
import { UploadResponse } from "./types";

export const uploadApi = {
    uploadAvatar: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiClient.post<UploadResponse>('/api/upload/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },

    uploadProjectImages: async (files: File[]): Promise<{ success: boolean; paths?: string[]; message?: string }> => {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));

        const res = await apiClient.post<{ success: boolean; paths?: string[]; message?: string }>(
            '/api/upload/project-images',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return res.data;
    },
};