'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProfileTabsProps {
    profileId: string;
}

const tabs = [
    { slug: '', label: 'General', icon: '👤', href: '/dashboard/profile' },
    { slug: 'skills', label: 'Skills', icon: '⚡', href: '/dashboard/profile/skills' },
    { slug: 'education', label: 'Education', icon: '🎓', href: '/dashboard/profile/education' },
    { slug: 'experience', label: 'Experience', icon: '💼', href: '/dashboard/profile/experience' },
    { slug: 'projects', label: 'Projects', icon: '📁', href: '/dashboard/profile/projects' },
    { slug: 'social-links', label: 'Social Links', icon: '🔗', href: '/dashboard/profile/social-links' },
];

export function ProfileTabs({ profileId }: ProfileTabsProps) {
    const pathname = usePathname();

    return (
        <div className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex gap-1 overflow-x-auto">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.slug}
                                href={tab.href}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${isActive
                                        ? 'text-accent border-accent'
                                        : 'text-muted border-transparent hover:text-foreground'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}