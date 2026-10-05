'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AvatarUploader } from './AvatarUploader';
import type {
    ApiResponse,
    Profile,
    CreateProfileRequest,
    UpdateProfileRequest,
    JobCategory,
} from '@/lib/types';
import { uploadApi } from '@/lib/uploadApi';
import { jobCategoryApi } from '@/lib/jobCategoryApi';

interface ProfileFormProps {
    mode: 'create' | 'edit';
    title: string;
    profileId?: string;
    initialData?: Profile;
    onSubmit: (data: CreateProfileRequest | UpdateProfileRequest) => Promise<ApiResponse<unknown>>;
}

export function ProfileForm({
    mode,
    title,
    profileId,
    initialData,
    onSubmit,
}: ProfileFormProps) {
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: initialData?.fullName || '',
        bio: initialData?.bio || '',
        shortBio: initialData?.shortBio || '',
        jobCategoryId: initialData?.jobCategoryId || '',
        jobTitle: initialData?.jobTitle || '',
        yearsOfExperience: initialData?.yearsOfExperience?.toString() || '',
        availableForHire: initialData?.availableForHire || false,
        email: initialData?.email || '',
        phoneNumber: initialData?.phoneNumber || '',
        location: initialData?.location || '',
        website: initialData?.website || '',
        dateOfBirth: initialData?.dateOfBirth?.split('T')[0] || '',
        nationality: initialData?.nationality || '',
        languages: initialData?.languages || '',
        hobbies: initialData?.hobbies || '',
        coverImageUrl: initialData?.coverImageUrl || '',
    });

    const [ownerPassword, setOwnerPassword] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        jobCategoryApi.getAll().then((res) => {
            if (res.success && res.data) setJobCategories(res.data);
        });
    }, []);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErrors([]);
        setStatus('');

        try {
            let avatarUrl = initialData?.avatarUrl ?? null;

            if (selectedFile) {
                setStatus('Uploading avatar...');
                const uploadRes = await uploadApi.uploadAvatar(selectedFile);

                if (!uploadRes.success || !uploadRes.path) {
                    setErrors([uploadRes.message || 'Upload failed']);
                    setLoading(false);
                    setStatus('');
                    return;
                }

                avatarUrl = uploadRes.path;
            }

            const payload =
                mode === 'create'
                    ? {
                        fullName: form.fullName,
                        bio: form.bio,
                        email: form.email || undefined,
                        location: form.location || undefined,
                        ownerPassword,
                    }
                    : {
                        fullName: form.fullName,
                        bio: form.bio,
                        shortBio: form.shortBio || null,
                        jobCategoryId: form.jobCategoryId || null,
                        jobTitle: form.jobTitle || null,
                        yearsOfExperience: form.yearsOfExperience ? parseInt(form.yearsOfExperience) : null,
                        availableForHire: form.availableForHire,
                        avatarUrl,
                        coverImageUrl: form.coverImageUrl || null,
                        email: form.email || null,
                        phoneNumber: form.phoneNumber || null,
                        location: form.location || null,
                        website: form.website || null,
                        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : null,
                        nationality: form.nationality || null,
                        languages: form.languages || null,
                        hobbies: form.hobbies || null,
                    };

            setStatus('Saving profile...');
            const res = await onSubmit(payload);

            if (res.success) {
                router.push('/dashboard/profile');
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
        <div className="space-y-6">
            {errors.length > 0 && <Alert variant="error" messages={errors} />}
            {mode === 'edit' && (
                <AvatarUploader
                    currentAvatarUrl={initialData?.avatarUrl}
                    selectedFile={selectedFile}
                    onFileSelected={setSelectedFile}
                />
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                    <Input
                        label="Full Name"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        maxLength={200}
                    />
                    {mode === 'edit' && (
                        <>
                            <Input
                                label="Job Title"
                                name="jobTitle"
                                value={form.jobTitle}
                                onChange={handleChange}
                                placeholder="e.g., Senior .NET Developer"
                                maxLength={200}
                            />
                            <Select
                                label="Job Category"
                                name="jobCategoryId"
                                value={form.jobCategoryId}
                                onChange={handleChange}
                                placeholder="Select a category..."
                                options={jobCategories.map((c) => ({ value: c.id, label: c.name }))}
                            />
                        </>
                    )}

                    <Textarea
                        label="Bio"
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        required
                        rows={4}
                        maxLength={2000}
                    />
                </div>
                {mode === 'edit' && (
                    <>
                        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Short Bio</h3>
                            <Textarea
                                label="Short Bio"
                                name="shortBio"
                                value={form.shortBio}
                                onChange={handleChange}
                                rows={2}
                                maxLength={500}
                            />
                        </div>
                        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Professional</h3>
                            <Input
                                label="Years of Experience"
                                name="yearsOfExperience"
                                type="number"
                                value={form.yearsOfExperience}
                                onChange={handleChange}
                                min={0}
                                max={70}
                            />
                            <Checkbox
                                label="Available for hire"
                                name="availableForHire"
                                checked={form.availableForHire}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                maxLength={200}
                            />
                            <Input
                                label="Phone Number"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                maxLength={50}
                            />
                            <Input
                                label="Location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                maxLength={200}
                            />
                            <Input
                                label="Website"
                                name="website"
                                type="url"
                                value={form.website}
                                onChange={handleChange}
                                maxLength={500}
                            />
                        </div>
                        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>

                            <Input
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                            />
                            <Input
                                label="Nationality"
                                name="nationality"
                                value={form.nationality}
                                onChange={handleChange}
                                maxLength={100}
                            />
                            <Input
                                label="Languages"
                                name="languages"
                                value={form.languages}
                                onChange={handleChange}
                                placeholder="Persian,English"
                                maxLength={500}
                            />
                            <Textarea
                                label="Hobbies"
                                name="hobbies"
                                value={form.hobbies}
                                onChange={handleChange}
                                rows={2}
                                maxLength={1000}
                            />
                        </div>
                    </>
                )}
                {mode === 'create' && (
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Owner Account</h3>
                        <Input
                            label="Owner Password"
                            name="ownerPassword"
                            type="password"
                            value={ownerPassword}
                            onChange={(e) => setOwnerPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            required
                        />
                    </div>
                )}
                <div className="flex gap-3">
                    <Button type="submit" loading={loading} variant="primary">
                        {status || (mode === 'create' ? 'Create Profile' : 'Save Changes')}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => router.back()} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}