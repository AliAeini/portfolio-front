'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
    { href: '/dashboard/profile', label: 'My Profile', icon: '👤' },
    { href: '/dashboard/profile/skills', label: 'Skills', icon: '⚡' },
    { href: '/dashboard/profile/education', label: 'Education', icon: '🎓' },
    { href: '/dashboard/profile/experience', label: 'Experience', icon: '💼' },
    { href: '/dashboard/profile/projects', label: 'Projects', icon: '📁' },
    { href: '/dashboard/profile/social-links', label: 'Social Links', icon: '🔗' },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    function handleLogout() {
        logout();
        router.push('/login');
    }

    return (
        <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
            <div className="p-6 border-b border-border">
                <Link href="/" className="text-foreground font-bold text-xl">
                    Portfolio<span className="text-accent">.</span>
                </Link>
                <p className="text-muted text-xs mt-1">Dashboard</p>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
                                ? 'bg-accent text-white'
                                : 'text-muted hover:text-foreground hover:bg-card-hover'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
                <div className="my-4 border-t border-border" />
                {user?.profileId && (
                    <Link
                        href={`/u/${user.profileId}`}
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                    >
                        <span className="text-lg">🌐</span>
                        <span className="text-sm font-medium">View Portfolio</span>
                    </Link>
                )}
            </nav>
            <div className="p-4 border-t border-border space-y-3">
                {user && (
                    <div className="px-2">
                        <p className="text-foreground text-sm font-medium truncate">
                            {user.fullName || user.email}
                        </p>
                        <p className="text-muted text-xs truncate">{user.email}</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted hover:text-red-400 hover:bg-card-hover transition-colors"
                >
                    <span className="text-lg">🚪</span>
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}