import { apiClient } from "./baseApi";
import { AddProfileSkillRequest, ApiResponse, ProfileSkill, UpdateProfileSkillRequest } from "./types";

export const profileSkillApi = {
    getByProfile: async (profileId: string): Promise<ApiResponse<ProfileSkill[]>> => {
        const res = await apiClient.get<ApiResponse<ProfileSkill[]>>(
            `/api/profiles/${profileId}/skills`
        );
        return res.data;
    },
    add: async (
        profileId: string,
        data: AddProfileSkillRequest
    ): Promise<ApiResponse<ProfileSkill>> => {
        const res = await apiClient.post<ApiResponse<ProfileSkill>>(
            `/api/profiles/${profileId}/skills`,
            data
        );
        return res.data;
    },
    update: async (
        profileId: string,
        profileSkillId: string,
        data: UpdateProfileSkillRequest
    ): Promise<ApiResponse<ProfileSkill>> => {
        const res = await apiClient.put<ApiResponse<ProfileSkill>>(
            `/api/profiles/${profileId}/skills/${profileSkillId}`,
            data
        );
        return res.data;
    },
    delete: async (
        profileId: string,
        profileSkillId: string
    ): Promise<ApiResponse<object>> => {
        const res = await apiClient.delete<ApiResponse<object>>(
            `/api/profiles/${profileId}/skills/${profileSkillId}`
        );
        return res.data;
    },
};