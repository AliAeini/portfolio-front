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
  avatarUrl?: string;
  email?: string;
  location?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  bio: string;
  avatarUrl?: string;
  email?: string;
  location?: string;
}