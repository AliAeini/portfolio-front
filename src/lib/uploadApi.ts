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
};