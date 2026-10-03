import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-gray-900 text-white">
                <div className="max-w-5xl mx-auto flex gap-6 p-4">
                    <Link href="/admin/profiles" className="hover:underline">Profiles</Link>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}