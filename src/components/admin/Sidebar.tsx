'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
    { href: '/admin/profiles', label: 'Profiles', icon: '👤' },
    { href: '/admin/profiles/skills', label: 'Skills', icon: '⚡' },
    // بعداً: Education, Experience, Projects, Social Links
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
    }

    return (
        <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
            <div className="p-6 border-b border-border">
                <Link href="/" className="text-foreground font-bold text-xl">
                    Portfolio<span className="text-accent">.</span>
                </Link>
                <p className="text-muted text-xs mt-1">Admin Panel</p>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
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
            </nav>
            <div className="p-4 border-t border-border">
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