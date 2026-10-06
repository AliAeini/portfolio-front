'use client';

import { SocialLinksManager } from '@/components/profile/SocialLinksManager';
import { useAuth } from '@/contexts/AuthContext';

export default function SocialLinksTab() {
    const { user } = useAuth();

    if (!user?.profileId) {
        return <div className="p-8 text-muted">Loading...</div>;
    }

    return (
        <SocialLinksManager profileId={user.profileId} />
    );
}