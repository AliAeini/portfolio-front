'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) return <Spinner />;

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}