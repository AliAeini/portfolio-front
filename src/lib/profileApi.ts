import { apiClient } from "./baseApi";
import { ApiResponse, CreateProfileRequest, Profile, ProfileSummary, UpdateAvatarRequest, UpdateProfileRequest } from "./types";

export const profileApi = {
    getAll: async (): Promise<ApiResponse<ProfileSummary[]>> => {
        const res = await apiClient.get<ApiResponse<ProfileSummary[]>>('/api/profiles');
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