'use client';

import { useParams } from 'next/navigation';
import { ProfileSkillsManager } from '@/components/profile/ProfileSkillsManager';

export default function SkillsTab() {
    const params = useParams();
    const profileId = params.id as string;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <ProfileSkillsManager profileId={profileId} />
        </div>
    );
}