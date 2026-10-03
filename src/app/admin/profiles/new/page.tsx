'use client';

import { ProfileForm } from '@/components/profile/ProfileForm';
import { profileApi } from '@/lib/api';
import type { CreateProfileRequest } from '@/lib/types';

export default function NewProfilePage() {
    return (
        <ProfileForm
            mode="create"
            title="New Profile"
            onSubmit={(data: CreateProfileRequest) => profileApi.create(data)}
        />
    );
}