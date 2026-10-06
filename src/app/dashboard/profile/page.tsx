'use client';

import { useEffect, useState } from 'react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { profileApi } from '@/lib/profileApi';
import type { ApiResponse, Profile, UpdateProfileRequest } from '@/lib/types';
import { Spinner } from '@/components/ui/Spinner';

export default function GeneralTab() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.profileId) return;

        async function load() {
            try {
                const res = await profileApi.getById(user?.profileId!);
                if (res.success && res.data) {
                    setProfile(res.data);
                } else {
                    setError(res.message);
                }
            } catch (err: unknown) {
                const apiErr = err as ApiResponse<unknown>;
                setError(apiErr?.message || 'Failed to load');
            }
        }
        load();
    }, [user]);

    if (error) return <div className="p-8 text-red-400">Error: {error}</div>;
    if (!profile || !user?.profileId) return <Spinner />;

    return (
        <ProfileForm
            mode="edit"
            title="General Information"
            profileId={user.profileId}
            initialData={profile}
            onSubmit={(data) => profileApi.update(user.profileId!, data as UpdateProfileRequest)}
        />
    );
}