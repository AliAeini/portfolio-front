import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

export const metadata: Metadata = {
    title: 'Portfolio',
    description: 'My personal portfolio',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en" className="dark">
            <body suppressHydrationWarning className="bg-background text-foreground antialiased">
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}