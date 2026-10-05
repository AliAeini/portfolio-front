import axios, { AxiosError } from 'axios';
import type {
    ApiResponse,
    Profile,
    CreateProfileRequest,
    UpdateProfileRequest,
    UpdateAvatarRequest,
    UploadResponse,
    Skill,
    SkillCategory,
    GroupedSkills,
    ProfileSkill,
    AddProfileSkillRequest,
    UpdateProfileSkillRequest,
    LookupSkillCategory,
    LookupProjectCategory,
} from './types';

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

export const profileApi = {
    getAll: async (): Promise<ApiResponse<Profile[]>> => {
        const res = await apiClient.get<ApiResponse<Profile[]>>('/api/profiles');
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

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
}

export const authApi = {
    login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
        return res.data;
    },
};

export const skillApi = {
    getAll: async (): Promise<ApiResponse<Skill[]>> => {
        const res = await apiClient.get<ApiResponse<Skill[]>>('/api/skills');
        return res.data;
    },
    getGrouped: async (): Promise<ApiResponse<GroupedSkills[]>> => {
        const res = await apiClient.get<ApiResponse<GroupedSkills[]>>('/api/skills/grouped');
        return res.data;
    },
    getCategories: async (): Promise<ApiResponse<SkillCategory[]>> => {
        const res = await apiClient.get<ApiResponse<SkillCategory[]>>('/api/skills/categories');
        return res.data;
    },
    getById: async (id: string): Promise<ApiResponse<Skill>> => {
        const res = await apiClient.get<ApiResponse<Skill>>(`/api/skills/${id}`);
        return res.data;
    },
};

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

export const lookupApi = {
    getSkillCategories: async (): Promise<ApiResponse<LookupSkillCategory[]>> => {
        const res = await apiClient.get<ApiResponse<LookupSkillCategory[]>>(
            '/api/lookups/skill-categories'
        );
        return res.data;
    },
    getProjectCategories: async (): Promise<ApiResponse<LookupProjectCategory[]>> => {
        const res = await apiClient.get<ApiResponse<LookupProjectCategory[]>>(
            '/api/lookups/project-categories'
        );
        return res.data;
    },
};

export { API_URL };