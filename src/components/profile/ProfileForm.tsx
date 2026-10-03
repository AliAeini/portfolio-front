'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import type { ApiResponse, CreateProfileRequest } from '@/lib/types';

interface ProfileFormProps {
    initialData?: CreateProfileRequest;
    onSubmit: (data: CreateProfileRequest) => Promise<ApiResponse<unknown>>;
    mode: 'create' | 'edit';
    title: string;
}

export function ProfileForm({ initialData, onSubmit, mode, title }: ProfileFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<CreateProfileRequest>({
        fullName: initialData?.fullName || '',
        bio: initialData?.bio || '',
        avatarUrl: initialData?.avatarUrl || '',
        email: initialData?.email || '',
        location: initialData?.location || '',
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        try {
            const res = await onSubmit(form);
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
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-100">{title}</h1>
                    <p className="text-gray-400 mt-2">
                        {mode === 'create'
                            ? 'Add a new profile to your portfolio.'
                            : 'Update the profile information below.'}
                    </p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
                    {errors.length > 0 && (
                        <div className="mb-6">
                            <Alert variant="error" title="Please fix the following issues:" messages={errors} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="e.g., Ali Aeini"
                            required
                            maxLength={200}
                        />

                        <Textarea
                            label="Bio"
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
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
                            placeholder="e.g., ali@example.com"
                            maxLength={200}
                        />

                        <Input
                            label="Avatar URL"
                            name="avatarUrl"
                            type="url"
                            value={form.avatarUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/avatar.jpg"
                            maxLength={500}
                        />

                        <Input
                            label="Location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="e.g., Tehran, Iran"
                            maxLength={200}
                        />

                        <div className="flex gap-3 pt-4 border-t border-gray-800">
                            <Button type="submit" loading={loading} variant="primary">
                                {mode === 'create' ? 'Create Profile' : 'Save Changes'}
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