import { apiClient } from "./baseApi";
import { ApiResponse, CreateSocialLinkRequest, SocialLink, UpdateSocialLinkRequest } from "./types";

export const socialLinkApi = {
    getByProfile: async (profileId: string): Promise<ApiResponse<SocialLink[]>> => {
        const res = await apiClient.get<ApiResponse<SocialLink[]>>(
            `/api/profiles/${profileId}/social-links`
        );
        return res.data;
    },
    add: async (
        profileId: string,
        data: CreateSocialLinkRequest
    ): Promise<ApiResponse<SocialLink>> => {
        const res = await apiClient.post<ApiResponse<SocialLink>>(
            `/api/profiles/${profileId}/social-links`,
            data
        );
        return res.data;
    },
    update: async (
        profileId: string,
        id: string,
        data: UpdateSocialLinkRequest
    ): Promise<ApiResponse<SocialLink>> => {
        const res = await apiClient.put<ApiResponse<SocialLink>>(
            `/api/profiles/${profileId}/social-links/${id}`,
            data
        );
        return res.data;
    },
    delete: async (profileId: string, id: string): Promise<ApiResponse<object>> => {
        const res = await apiClient.delete<ApiResponse<object>>(
            `/api/profiles/${profileId}/social-links/${id}`
        );
        return res.data;
    },
};