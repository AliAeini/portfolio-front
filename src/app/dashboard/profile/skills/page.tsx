'use client';

import { ProfileSkillsManager } from '@/components/profile/ProfileSkillsManager';
import { useAuth } from '@/contexts/AuthContext';

export default function SkillsTab() {
    const { user } = useAuth();

    if (!user?.profileId) return <div className="p-8 text-muted">Loading...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <ProfileSkillsManager profileId={user.profileId} />
        </div>
    );
}