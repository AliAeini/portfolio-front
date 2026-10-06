'use client';

import { ExperiencesManager } from '@/components/profile/ExperiencesManager';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/contexts/AuthContext';

export default function ExperienceTab() {
    const { user } = useAuth();

    if (!user?.profileId) return <Spinner />
    
    return (
        <ExperiencesManager profileId={user.profileId} />
    );
}