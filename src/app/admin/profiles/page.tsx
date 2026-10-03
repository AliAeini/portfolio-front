'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { profileApi } from '@/lib/api';
import type { Profile, ApiResponse } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function ProfilesPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProfiles();
    }, []);

    async function loadProfiles() {
        try {
            setLoading(true);
            setError(null);
            const res = await profileApi.getAll();
            if (res.success && res.data) {
                setProfiles(res.data);
            } else {
                setError(res.message);
            }
        } catch (err: unknown) {
            const apiErr = err as ApiResponse<unknown>;
            setError(apiErr?.message || 'Failed to load profiles');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Delete "${name}"?`)) return;
        try {
            await profileApi.delete(id);
            await loadProfiles();
        } catch (err: unknown) {
            const apiErr = err as ApiResponse<unknown>;
            alert(apiErr?.message || 'Failed to delete');
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-100">Profiles</h1>
                        <p className="text-gray-400 mt-1">Manage your profile information</p>
                    </div>
                    <Link href="/admin/profiles/new">
                        <Button variant="primary">+ New Profile</Button>
                    </Link>
                </div>

                {error && (
                    <div className="mb-6">
                        <Alert variant="error" messages={[error]} />
                    </div>
                )}

                {loading ? (
                    <div className="text-gray-400 text-center py-12">Loading...</div>
                ) : profiles.length === 0 ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                        <p className="text-gray-400 mb-4">No profiles yet.</p>
                        <Link href="/admin/profiles/new">
                            <Button variant="primary">Create your first profile</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-800/50 border-b border-gray-800">
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Location</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((p) => (
                                    <tr key={p.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4 text-gray-100">{p.fullName}</td>
                                        <td className="px-6 py-4 text-gray-400">{p.email || '—'}</td>
                                        <td className="px-6 py-4 text-gray-400">{p.location || '—'}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                href={`/admin/profiles/${p.id}/edit`}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p.id, p.fullName)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}