import { apiClient } from "./baseApi";
import { ApiResponse, GroupedSkills, Skill, SkillCategory } from "./types";

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