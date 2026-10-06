'use client';

import { EducationsManager } from '@/components/profile/EducationsManager';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/contexts/AuthContext';

export default function EducationTab() {
    const { user } = useAuth();

    if (!user?.profileId) return <Spinner />;

    return (
        <EducationsManager profileId={user.profileId} />
    );
}