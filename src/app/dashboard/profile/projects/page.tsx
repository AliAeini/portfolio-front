'use client';

import { ProjectsManager } from '@/components/profile/ProjectsManager';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/contexts/AuthContext';

export default function ProjectsTab() {
    const { user } = useAuth();

    if (!user?.profileId) return <Spinner />

    return (
        <ProjectsManager profileId={user.profileId} />
    );
}