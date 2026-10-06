import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { Toaster } from 'react-hot-toast';

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
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1a1d24',
                            color: '#f3f4f6',
                            border: '1px solid #2d333b',
                            borderRadius: '8px',
                            fontSize: '14px',
                        },
                        success: {
                            iconTheme: { primary: '#10b981', secondary: '#fff' },
                        },
                        error: {
                            iconTheme: { primary: '#ef4444', secondary: '#fff' },
                        },
                    }}
                />
            </body>
        </html>
    );
}