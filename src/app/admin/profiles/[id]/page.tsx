'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { profileApi } from '@/lib/api';
import type { ApiResponse, UpdateProfileRequest } from '@/lib/types';

export default function GeneralTab() {
    const params = useParams();
    const id = params.id as string;
    const [initialData, setInitialData] = useState<{
        fullName: string;
        bio: string;
        email?: string | null;
        location?: string | null;
        avatarUrl?: string | null;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await profileApi.getById(id);
                if (res.success && res.data) {
                    setInitialData({
                        fullName: res.data.fullName,
                        bio: res.data.bio,
                        email: res.data.email || '',
                        location: res.data.location || '',
                        avatarUrl: res.data.avatarUrl,
                    });
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
    if (!initialData) return <div className="p-8 text-muted">Loading...</div>;

    return (
        <ProfileForm
            mode="edit"
            title=""
            initialData={initialData}
            onSubmit={(data) => profileApi.update(id, data as UpdateProfileRequest)}
        />
    );
}