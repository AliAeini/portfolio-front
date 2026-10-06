import { apiClient } from './baseApi';
import type {
    ApiResponse,
    Experience,
    CreateExperienceRequest,
    UpdateExperienceRequest,
} from './types';

export const experienceApi = {
    getByProfile: async (profileId: string): Promise<ApiResponse<Experience[]>> => {
        const res = await apiClient.get<ApiResponse<Experience[]>>(
            `/api/profiles/${profileId}/experiences`
        );
        return res.data;
    },

    getById: async (profileId: string, id: string): Promise<ApiResponse<Experience>> => {
        const res = await apiClient.get<ApiResponse<Experience>>(
            `/api/profiles/${profileId}/experiences/${id}`
        );
        return res.data;
    },

    create: async (
        profileId: string,
        data: CreateExperienceRequest
    ): Promise<ApiResponse<Experience>> => {
        const res = await apiClient.post<ApiResponse<Experience>>(
            `/api/profiles/${profileId}/experiences`,
            data
        );
        return res.data;
    },

    update: async (
        profileId: string,
        experienceId: string,
        data: UpdateExperienceRequest
    ): Promise<ApiResponse<Experience>> => {
        const res = await apiClient.put<ApiResponse<Experience>>(
            `/api/profiles/${profileId}/experiences/${experienceId}`,
            data
        );
        return res.data;
    },

    delete: async (
        profileId: string,
        experienceId: string
    ): Promise<ApiResponse<object>> => {
        const res = await apiClient.delete<ApiResponse<object>>(
            `/api/profiles/${profileId}/experiences/${experienceId}`
        );
        return res.data;
    },
};