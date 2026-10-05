import { apiClient } from "./baseApi";
import { ApiResponse, LookupProjectCategory, LookupSkillCategory } from "./types";

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