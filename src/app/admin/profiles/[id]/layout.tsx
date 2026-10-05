'use client';

import { useParams } from 'next/navigation';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const profileId = params.id as string;

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border bg-card/30">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <a
                        href="/admin/profiles"
                        className="text-muted hover:text-foreground text-sm"
                    >
                        ← Profiles
                    </a>
                    <h1 className="text-2xl font-bold text-foreground mt-2">
                        Edit Profile
                    </h1>
                </div>
            </div>
            <ProfileTabs profileId={profileId} />
            <div>{children}</div>
        </div>
    );
}