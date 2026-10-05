export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors: string[] | null;
    timestamp: string;
}

export interface Profile {
    id: string;
    fullName: string;
    bio: string;
    avatarUrl: string | null;
    email: string | null;
    location: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateProfileRequest {
    fullName: string;
    bio: string;
    email?: string;
    location?: string;
    ownerPassword?: string;
}

export interface UpdateProfileRequest {
    fullName: string;
    bio: string;
    email?: string;
    location?: string;
}

export interface UpdateAvatarRequest {
    avatarUrl: string;
}

export interface UploadResponse {
    success: boolean;
    path?: string;
    message?: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number;
    displayOrder: number;
    iconUrl: string | null;
    category: SkillCategory | null;
}

export interface SkillCategory {
    id: string;
    name: string;
    description: string | null;
    displayOrder: number;
    skillCount: number;
}

export interface GroupedSkills {
    categoryId: string;
    categoryName: string;
    categoryDescription: string | null;
    categoryDisplayOrder: number;
    skills: SkillItem[];
}

export interface SkillItem {
    id: string;
    name: string;
    level: number;
    displayOrder: number;
    iconUrl: string | null;
}

export interface ProfileSkill {
    id: string;
    skillId: string;
    skillName: string;
    skillIconUrl: string | null;
    categoryName: string | null;
    level: number;
    displayOrder: number;
}

export interface AddProfileSkillRequest {
    skillId: string;
    level?: number;
    displayOrder?: number;
}

export interface UpdateProfileSkillRequest {
    level: number;
    displayOrder?: number;
}

export interface LookupSkillCategory {
    id: string;
    name: string;
    description: string | null;
    displayOrder: number;
}

export interface LookupProjectCategory {
    id: string;
    name: string;
    description: string | null;
    displayOrder: number;
}

export interface AuthUser {
    id: string;
    email: string;
    fullName: string | null;
    role: string;
}

export interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: string | null;
    isAuthenticated: boolean;
}