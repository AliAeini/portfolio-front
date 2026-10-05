import { apiClient } from "./baseApi";
import { ApiResponse, JobCategory } from "./types";

export const jobCategoryApi = {
    getAll: async (): Promise<ApiResponse<JobCategory[]>> => {
        const res = await apiClient.get<ApiResponse<JobCategory[]>>('/api/lookups/job-categories');
        return res.data;
    },
};