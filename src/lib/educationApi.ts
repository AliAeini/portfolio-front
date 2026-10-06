import { apiClient } from './baseApi';
import type {
    ApiResponse,
    Education,
    CreateEducationRequest,
    UpdateEducationRequest,
} from './types';

export const educationApi = {
    getByProfile: async (profileId: string): Promise<ApiResponse<Education[]>> => {
        const res = await apiClient.get<ApiResponse<Education[]>>(
            `/api/profiles/${profileId}/educations`
        );
        return res.data;
    },

    getById: async (profileId: string, id: string): Promise<ApiResponse<Education>> => {
        const res = await apiClient.get<ApiResponse<Education>>(
            `/api/profiles/${profileId}/educations/${id}`
        );
        return res.data;
    },

    create: async (
        profileId: string,
        data: CreateEducationRequest
    ): Promise<ApiResponse<Education>> => {
        const res = await apiClient.post<ApiResponse<Education>>(
            `/api/profiles/${profileId}/educations`,
            data
        );
        return res.data;
    },

    update: async (
        profileId: string,
        educationId: string,
        data: UpdateEducationRequest
    ): Promise<ApiResponse<Education>> => {
        const res = await apiClient.put<ApiResponse<Education>>(
            `/api/profiles/${profileId}/educations/${educationId}`,
            data
        );
        return res.data;
    },

    delete: async (
        profileId: string,
        educationId: string
    ): Promise<ApiResponse<object>> => {
        const res = await apiClient.delete<ApiResponse<object>>(
            `/api/profiles/${profileId}/educations/${educationId}`
        );
        return res.data;
    },
};