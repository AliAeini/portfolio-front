'use client';

import { useEffect, useState } from 'react';
import { socialLinkApi } from '@/lib/socialLinkApi';
import { lookupApi } from '@/lib/lookupApi';
import { Button } from '@/components/ui/Button';
import { SocialLinkFormModal } from './SocialLinkFormModal';
import type { SocialLink, SocialPlatform } from '@/lib/types';
import { Spinner } from '../ui/Spinner';

interface SocialLinksManagerProps {
    profileId: string;
}

export function SocialLinksManager({ profileId }: SocialLinksManagerProps) {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [profileId]);

    async function loadData() {
        try {
            setLoading(true);

            const [linksRes, platformsRes] = await Promise.all([
                socialLinkApi.getByProfile(profileId),
                lookupApi.getSocialPlatforms(),
            ]);

            if (linksRes.success && linksRes.data) setLinks(linksRes.data);
            if (platformsRes.success && platformsRes.data) setPlatforms(platformsRes.data);
        } finally {
            setLoading(false);
        }
    }

    function handleAdd() {
        setEditingLink(null);
        setShowModal(true);
    }

    function handleEdit(link: SocialLink) {
        setEditingLink(link);
        setShowModal(true);
    }

    function handleFormSuccess(link: SocialLink, isNew: boolean) {
        if (isNew) {
            setLinks([...links, link]);
        } else {
            setLinks(links.map((l) => (l.id === link.id ? link : l)));
        }
    }

    async function handleDelete(link: SocialLink) {
        if (!confirm(`Delete "${link.platformName}"?`)) return;

        try {
            const res = await socialLinkApi.delete(profileId, link.id);
            if (res.success) setLinks(links.filter((l) => l.id !== link.id));
        } catch {
            // interceptor
        }
    }

    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-foreground">
                        Social Links ({links.length})
                    </h2>
                    <p className="text-muted text-sm mt-1">
                        Your social media and professional profiles
                    </p>
                </div>
                <Button onClick={handleAdd} variant="primary">
                    + Add Link
                </Button>
            </div>

            {links.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <p className="text-muted mb-4">No social links added yet.</p>
                    <Button onClick={handleAdd} variant="primary">
                        Add your first link
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            className="bg-card border border-border rounded-lg p-4 flex items-start gap-4"
                        >
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                {link.iconUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={link.iconUrl} alt={link.platformName} className="w-8 h-8 object-contain" />
                                ) : (
                                    <span className="text-2xl">🔗</span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-foreground font-semibold">{link.platformName}</h3>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:underline text-sm break-all"
                                >
                                    {link.url}
                                </a>

                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleEdit(link)}
                                        className="text-accent hover:text-accent-hover text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(link)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <SocialLinkFormModal
                isOpen={showModal}
                profileId={profileId}
                socialLink={editingLink || undefined}
                platforms={platforms}
                onClose={() => setShowModal(false)}
                onSuccess={handleFormSuccess}
            />
        </div>
    );
}