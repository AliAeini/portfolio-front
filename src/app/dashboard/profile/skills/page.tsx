'use client';

import { ProfileSkillsManager } from '@/components/profile/ProfileSkillsManager';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/contexts/AuthContext';

export default function SkillsTab() {
    const { user } = useAuth();

    if (!user?.profileId) return <Spinner />;

    return (
        <ProfileSkillsManager profileId={user.profileId} />
    );
}