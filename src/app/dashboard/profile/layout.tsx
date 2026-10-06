'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

export default function ProfileLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border bg-card/30">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    <p className="text-muted text-sm mt-1">
                        Manage your portfolio information
                    </p>
                </div>
            </div>
            {user?.profileId && <ProfileTabs profileId={user.profileId} />}
            <div className='p-8 max-w-4xl mx-auto'>
                {children}
            </div>
        </div>
    );
}