import { apiClient } from './baseApi';
import type {
    ApiResponse,
    Project,
    CreateProjectRequest,
    UpdateProjectRequest,
} from './types';

export const projectApi = {
    getByProfile: async (profileId: string): Promise<ApiResponse<Project[]>> => {
        const res = await apiClient.get<ApiResponse<Project[]>>(
            `/api/profiles/${profileId}/projects`
        );
        return res.data;
    },

    getById: async (profileId: string, id: string): Promise<ApiResponse<Project>> => {
        const res = await apiClient.get<ApiResponse<Project>>(
            `/api/profiles/${profileId}/projects/${id}`
        );
        return res.data;
    },

    create: async (
        profileId: string,
        data: CreateProjectRequest
    ): Promise<ApiResponse<Project>> => {
        const res = await apiClient.post<ApiResponse<Project>>(
            `/api/profiles/${profileId}/projects`,
            data
        );
        return res.data;
    },

    update: async (
        profileId: string,
        projectId: string,
        data: UpdateProjectRequest
    ): Promise<ApiResponse<Project>> => {
        const res = await apiClient.put<ApiResponse<Project>>(
            `/api/profiles/${profileId}/projects/${projectId}`,
            data
        );
        return res.data;
    },

    delete: async (profileId: string, projectId: string): Promise<ApiResponse<object>> => {
        const res = await apiClient.delete<ApiResponse<object>>(
            `/api/profiles/${profileId}/projects/${projectId}`
        );
        return res.data;
    },
};