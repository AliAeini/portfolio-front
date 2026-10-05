'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AvatarUploader } from './AvatarUploader';
import { uploadApi } from '@/lib/api';
import type { ApiResponse, CreateProfileRequest, UpdateProfileRequest } from '@/lib/types';

interface ProfileFormProps {
    initialData?: {
        fullName: string;
        bio: string;
        email?: string | null;
        location?: string | null;
        avatarUrl?: string | null;
    };
    onSubmit: (data: CreateProfileRequest | UpdateProfileRequest) => Promise<ApiResponse<unknown>>;
    mode: 'create' | 'edit';
    title: string;
}

export function ProfileForm({ initialData, onSubmit, mode, title }: ProfileFormProps) {
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: initialData?.fullName || '',
        bio: initialData?.bio || '',
        email: initialData?.email || '',
        location: initialData?.location || '',
    });

    const [ownerPassword, setOwnerPassword] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErrors([]);
        setStatus('');

        try {
            let avatarUrl: string | null = null;

            if (mode === 'edit' && selectedFile) {
                setStatus('Uploading avatar...');

                const uploadRes = await uploadApi.uploadAvatar(selectedFile);

                if (!uploadRes.success || !uploadRes.path) {
                    setErrors(!uploadRes || [uploadRes.message || 'Upload failed']);
                    setLoading(false);
                    setStatus('');
                    return;
                }

                avatarUrl = uploadRes.path;
            }

            setStatus('Saving profile...');

            const payload =
                mode === 'create'
                    ? { ...form, ownerPassword }
                    : { ...form, avatarUrl };

            const res = await onSubmit(payload);

            if (res.success) {
                router.push('/admin/profiles');
                router.refresh();
            } else {
                setErrors(res.errors || [res.message]);
            }
        } catch (err: unknown) {
            const apiErr = err as ApiResponse<unknown>;
            setErrors(apiErr?.errors || [apiErr?.message || 'Something went wrong']);
        } finally {
            setLoading(false);
            setStatus('');
        }
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-100">{title}</h1>
                    <p className="text-gray-400 mt-2">
                        {mode === 'create'
                            ? 'Add a new profile to your portfolio.'
                            : 'Update the profile information below.'}
                    </p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg space-y-6">
                    {errors.length > 0 && (
                        <Alert variant="error" title="Please fix the following issues:" messages={errors} />
                    )}
                    {mode === 'edit' && (
                        <AvatarUploader
                            currentAvatarUrl={initialData?.avatarUrl}
                            selectedFile={selectedFile}
                            onFileSelected={setSelectedFile}
                        />
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            maxLength={200}
                        />

                        <Textarea
                            label="Bio"
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            required
                            rows={4}
                            maxLength={2000}
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            maxLength={200}
                        />

                        <Input
                            label="Location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            maxLength={200}
                        />

                        {mode === 'create' && (
                            <Input
                                label="Owner Password"
                                name="ownerPassword"
                                type="password"
                                value={ownerPassword}
                                onChange={(e) => setOwnerPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                required
                            />
                        )}

                        <div className="flex gap-3 pt-4 border-t border-gray-800">
                            <Button type="submit" loading={loading} variant="primary">
                                {status || (mode === 'create' ? 'Create Profile' : 'Save Changes')}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}