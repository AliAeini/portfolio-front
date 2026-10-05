'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProfileForm } from '@/components/profile/ProfileForm';
import type { ApiResponse, Profile, UpdateProfileRequest } from '@/lib/types';
import { profileApi } from '@/lib/profileApi';

export default function GeneralTab() {
    const params = useParams();
    const id = params.id as string;

    const [profile, setProfile] = useState<Profile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await profileApi.getById(id);
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
    }, [id]);

    if (error) return <div className="p-8 text-red-400">Error: {error}</div>;
    if (!profile) return <div className="p-8 text-muted">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <ProfileForm
                mode="edit"
                title="General Information"
                profileId={id}
                initialData={profile}
                onSubmit={(data) => profileApi.update(id, data as UpdateProfileRequest)}
            />
        </div>
    );
}