
export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserInfo {
    id: string;
    email: string;
    fullName: string | null;
    role: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    user: UserInfo;
    profileId: string
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors: string[] | null;
    timestamp: string;
}

export interface ProfileSummary {
    id: string;
    fullName: string;
    jobTitle: string | null;
    jobCategoryName: string | null;
    avatarUrl: string | null;
    location: string | null;
    availableForHire: boolean;
    skillCount: number;
}

export interface Profile {
    id: string;
    fullName: string;
    bio: string;
    shortBio: string | null;
    jobCategoryId: string | null;
    jobCategoryName: string | null;
    jobTitle: string | null;
    yearsOfExperience: number | null;
    availableForHire: boolean;
    avatarUrl: string | null;
    coverImageUrl: string | null;
    email: string | null;
    phoneNumber: string | null;
    location: string | null;
    website: string | null;
    dateOfBirth: string | null;
    nationality: string | null;
    languages: string | null;
    hobbies: string | null;
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
    shortBio?: string | null;
    jobCategoryId?: string | null;
    jobTitle?: string | null;
    yearsOfExperience?: number | null;
    availableForHire: boolean;
    avatarUrl?: string | null;
    coverImageUrl?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    location?: string | null;
    website?: string | null;
    dateOfBirth?: string | null;
    nationality?: string | null;
    languages?: string | null;
    hobbies?: string | null;
}

export interface UpdateAvatarRequest {
    avatarUrl: string;
}

export interface UploadResponse {
    success: boolean;
    path?: string;
    message?: string;
}

export interface JobCategory {
    id: string;
    name: string;
    description: string | null;
    displayOrder: number;
}

export interface SkillCategory {
    id: string;
    name: string;
    description: string | null;
    displayOrder: number;
    skillCount: number;
}

export interface Skill {
    id: string;
    name: string;
    level: number;
    displayOrder: number;
    iconUrl: string | null;
    category: SkillCategory | null;
}

export interface SkillItem {
    id: string;
    name: string;
    level: number;
    displayOrder: number;
    iconUrl: string | null;
}

export interface GroupedSkills {
    categoryId: string;
    categoryName: string;
    categoryDescription: string | null;
    categoryDisplayOrder: number;
    skills: SkillItem[];
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

export interface AuthUser {
    id: string;
    email: string;
    fullName: string | null;
    role: string;
    profileId?: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
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

export interface Education {
    id: string;
    profileId: string;
    institution: string;
    degree: number;
    degreeName: string;
    field: string;
    startDate: string;
    endDate: string | null;
    description: string | null;
    location: string | null;
    grade: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateEducationRequest {
    institution: string;
    degree: number;
    field: string;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
    location?: string | null;
    grade?: string | null;
    displayOrder?: number;
}

export interface UpdateEducationRequest {
    institution: string;
    degree: number;
    field: string;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
    location?: string | null;
    grade?: string | null;
    displayOrder: number;
}

export interface DegreeLevel {
    value: number;
    name: string;
}

export interface Experience {
    id: string;
    profileId: string;
    company: string;
    position: string;
    employmentType: number;
    employmentTypeName: string;
    startDate: string;
    endDate: string | null;
    description: string | null;
    location: string | null;
    companyUrl: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateExperienceRequest {
    company: string;
    position: string;
    employmentType: number;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
    location?: string | null;
    companyUrl?: string | null;
    displayOrder?: number;
}

export interface UpdateExperienceRequest {
    company: string;
    position: string;
    employmentType: number;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
    location?: string | null;
    companyUrl?: string | null;
    displayOrder: number;
}

export interface EmploymentType {
    value: number;
    name: string;
}

export interface Project {
    id: string;
    profileId: string;
    projectCategoryId: string | null;
    projectCategoryName: string | null;
    title: string;
    description: string;
    shortDescription: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    startDate: string | null;
    endDate: string | null;
    isFeatured: boolean;
    displayOrder: number;
    skills: ProjectSkill[];
    images: ProjectImage[];
    createdAt: string;
    updatedAt: string | null;
}

export interface ProjectSkill {
    id: string;
    profileSkillId: string;
    skillId: string;
    skillName: string;
    skillIconUrl: string | null;
    categoryName: string | null;
    level: number;
    displayOrder: number;
}

export interface ProjectImage {
    id: string;
    imageUrl: string;
    caption: string | null;
    isCover: boolean;
    displayOrder: number;
}

export interface CreateProjectRequest {
    title: string;
    description: string;
    projectCategoryId?: string | null;
    shortDescription?: string | null;
    githubUrl?: string | null;
    liveUrl?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    isFeatured?: boolean;
    displayOrder?: number;
    profileSkillIds?: string[];
    images?: ProjectImageInput[];
}

export interface UpdateProjectRequest {
    title: string;
    description: string;
    projectCategoryId?: string | null;
    shortDescription?: string | null;
    githubUrl?: string | null;
    liveUrl?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    isFeatured: boolean;
    displayOrder: number;
    profileSkillIds?: string[];
    images?: ProjectImageInput[];
}

export interface ProjectImageInput {
    id?: string | null;
    imageUrl?: string | null;
    file?: File;
    previewUrl?: string;
    caption?: string | null;
    isCover: boolean;
    displayOrder: number;
}

export interface ProjectCategory {
    id: string;
    name: string;
    description: string | null;
    displayOrder: number;
}

export interface SocialLink {
    id: string;
    profileId: string;
    platform: number;
    platformName: string;
    url: string;
    iconUrl: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateSocialLinkRequest {
    platform: number;
    url: string;
    iconUrl?: string | null;
    displayOrder?: number;
}

export interface UpdateSocialLinkRequest {
    platform: number;
    url: string;
    iconUrl?: string | null;
    displayOrder: number;
}

export interface SocialPlatform {
    value: number;
    name: string;
}