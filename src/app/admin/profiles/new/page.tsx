'use client';

import { ProfileForm } from '@/components/profile/ProfileForm';
import { profileApi } from '@/lib/profileApi';
import type { CreateProfileRequest } from '@/lib/types';

export default function NewProfilePage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <ProfileForm
                mode="create"
                title="New Profile"
                onSubmit={(data) => profileApi.create(data as CreateProfileRequest)}
            />
        </div>
    );
}