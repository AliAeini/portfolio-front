'use client';

import { useEffect, useState } from 'react';
import { socialLinkApi } from '@/lib/socialLinkApi';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type {
    SocialLink,
    SocialPlatform,
    CreateSocialLinkRequest,
    UpdateSocialLinkRequest,
} from '@/lib/types';

interface SocialLinkFormModalProps {
    isOpen: boolean;
    profileId: string;
    socialLink?: SocialLink;
    platforms: SocialPlatform[];
    onClose: () => void;
    onSuccess: (link: SocialLink, isNew: boolean) => void;
}

export function SocialLinkFormModal({
    isOpen,
    profileId,
    socialLink,
    platforms,
    onClose,
    onSuccess,
}: SocialLinkFormModalProps) {
    const isEdit = !!socialLink;

    const [form, setForm] = useState({
        platform: 10,
        url: '',
        iconUrl: '',
        displayOrder: 0,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setForm({
                platform: socialLink?.platform || 10,
                url: socialLink?.url || '',
                iconUrl: socialLink?.iconUrl || '',
                displayOrder: socialLink?.displayOrder || 0,
            });
        }
    }, [isOpen, socialLink]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        if (name === 'platform' || name === 'displayOrder') {
            setForm({ ...form, [name]: value === '' ? 0 : parseInt(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                platform: form.platform,
                url: form.url,
                iconUrl: form.iconUrl || null,
                displayOrder: form.displayOrder,
            };

            const res = isEdit
                ? await socialLinkApi.update(profileId, socialLink!.id, payload as UpdateSocialLinkRequest)
                : await socialLinkApi.create(profileId, payload as CreateSocialLinkRequest);

            if (res.success && res.data) {
                onSuccess(res.data, !isEdit);
                onClose();
            }
        } catch {
            // interceptor
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Social Link' : 'Add Social Link'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Select
                    label="Platform"
                    name="platform"
                    value={form.platform.toString()}
                    onChange={handleChange}
                    placeholder="Select platform..."
                    options={platforms.map((p) => ({
                        value: p.value.toString(),
                        label: p.name,
                    }))}
                    required
                />

                <Input
                    label="URL"
                    name="url"
                    type="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="https://..."
                    required
                    maxLength={500}
                />

                <Input
                    label="Icon URL (optional)"
                    name="iconUrl"
                    type="url"
                    value={form.iconUrl}
                    onChange={handleChange}
                    placeholder="https://.../icon.png"
                    maxLength={500}
                />

                <Input
                    label="Display Order"
                    name="displayOrder"
                    type="number"
                    value={form.displayOrder.toString()}
                    onChange={handleChange}
                    min={0}
                />

                <div className="flex gap-3 pt-4 border-t border-border">
                    <Button type="submit" loading={loading} variant="primary">
                        {isEdit ? 'Save Changes' : 'Add Link'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}