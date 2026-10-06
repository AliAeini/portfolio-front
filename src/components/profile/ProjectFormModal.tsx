'use client';

import { useEffect, useState } from 'react';
import { projectApi } from '@/lib/projectApi';
import { lookupApi } from '@/lib/lookupApi';
import { profileSkillApi } from '@/lib/profileSkillApi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProjectImagesManager } from './ProjectImagesManager';
import type {
    Project,
    ProjectCategory,
    ProfileSkill,
    ProjectImageInput,
    CreateProjectRequest,
    UpdateProjectRequest,
    ApiResponse,
} from '@/lib/types';
import { uploadApi } from '@/lib/uploadApi';

interface ProjectFormModalProps {
    isOpen: boolean;
    profileId: string;
    project?: Project;
    onClose: () => void;
    onSuccess: (project: Project, isNew: boolean) => void;
}

export function ProjectFormModal({
    isOpen,
    profileId,
    project,
    onClose,
    onSuccess,
}: ProjectFormModalProps) {
    const isEdit = !!project;

    const [form, setForm] = useState({
        title: '',
        description: '',
        shortDescription: '',
        projectCategoryId: '',
        githubUrl: '',
        liveUrl: '',
        startDate: '',
        endDate: '',
        isFeatured: false,
        displayOrder: 0,
    });

    const [profileSkillIds, setProfileSkillIds] = useState<string[]>([]);
    const [images, setImages] = useState<ProjectImageInput[]>([]);
    const [categories, setCategories] = useState<ProjectCategory[]>([]);
    const [availableSkills, setAvailableSkills] = useState<ProfileSkill[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setForm({
                title: project?.title || '',
                description: project?.description || '',
                shortDescription: project?.shortDescription || '',
                projectCategoryId: project?.projectCategoryId || '',
                githubUrl: project?.githubUrl || '',
                liveUrl: project?.liveUrl || '',
                startDate: project?.startDate?.split('T')[0] || '',
                endDate: project?.endDate?.split('T')[0] || '',
                isFeatured: project?.isFeatured || false,
                displayOrder: project?.displayOrder || 0,
            });

            setProfileSkillIds(project?.skills.map((s) => s.profileSkillId) || []);
            setImages(
                (project?.images.map((img) => ({
                    id: img.id,
                    imageUrl: img.imageUrl,
                    caption: img.caption,
                    isCover: img.isCover,
                    displayOrder: img.displayOrder,
                })) || [])?.filter(i => !!i?.id)
            );

            Promise.all([
                lookupApi.getProjectCategories(),
                profileSkillApi.getByProfile(profileId),
            ]).then(([catRes, skillRes]) => {
                if (catRes.success && catRes.data) setCategories(catRes.data);
                if (skillRes.success && skillRes.data) setAvailableSkills(skillRes.data);
            });
        }
    }, [isOpen, project, profileId]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name === 'displayOrder') {
            setForm({ ...form, [name]: value === '' ? 0 : parseInt(value) });
        } else if (type === 'checkbox') {
            setForm({ ...form, [name]: checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    function handleSkillToggle(profileSkillId: string) {
        setProfileSkillIds((prev) =>
            prev.includes(profileSkillId)
                ? prev.filter((id) => id !== profileSkillId)
                : [...prev, profileSkillId]
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const newFiles: File[] = images.filter((img) => img.file && !img.imageUrl).map((img) => img.file!);
            console.log({ images })
            let uploadedPaths: string[] = [];

            if (newFiles.length > 0) {
                setStatus('Uploading images...');
                const uploadRes = await uploadApi.uploadProjectImages(newFiles);

                if (!uploadRes.success || !uploadRes.paths) {
                    setErrors([uploadRes.message || 'Upload failed']);
                    setLoading(false);
                    setStatus('');
                    return;
                }

                uploadedPaths = uploadRes.paths;
            }
            let uploadIndex = 0;

            const finalImages = images
                .map((img) => {
                    let imageUrl = img.imageUrl;

                    if (img.file && !img.imageUrl) {
                        if (uploadIndex >= uploadedPaths.length) {
                            console.error('Missing uploaded path for image at index', uploadIndex);
                            return null;
                        }
                        imageUrl = uploadedPaths[uploadIndex++];
                    }

                    if (!imageUrl) {
                        console.warn('Skipping image without URL', img);
                        return null;
                    }

                    return {
                        id: img.id ?? null,
                        imageUrl: imageUrl,
                        caption: img.caption ?? null,
                        isCover: img.isCover,
                        displayOrder: img.displayOrder,
                    };
                })
                .filter((img): img is NonNullable<typeof img> => img !== null);

            console.log({ finalImages, images, uploadedPaths })
            const payload = {
                title: form.title,
                description: form.description,
                shortDescription: form.shortDescription || null,
                projectCategoryId: form.projectCategoryId || null,
                githubUrl: form.githubUrl || null,
                liveUrl: form.liveUrl || null,
                startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
                endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
                isFeatured: form.isFeatured,
                displayOrder: form.displayOrder,
                profileSkillIds,
                images: finalImages,
            };

            setStatus('Saving project...');
            const res = isEdit
                ? await projectApi.update(profileId, project!.id, payload as UpdateProjectRequest)
                : await projectApi.create(profileId, payload as CreateProjectRequest);

            if (res.success && res.data) {
                images.forEach((img) => {
                    if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
                });

                onSuccess(res.data, !isEdit);
                onClose();
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Project' : 'Add Project'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                    label="Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Portfolio Website"
                    required
                    maxLength={200}
                />
                <Input
                    label="Short Description"
                    name="shortDescription"
                    value={form.shortDescription}
                    onChange={handleChange}
                    placeholder="A brief summary (max 500 chars)"
                    maxLength={500}
                />
                <Textarea
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your project in detail..."
                    required
                    rows={5}
                    maxLength={5000}
                />
                <Select
                    label="Category"
                    name="projectCategoryId"
                    value={form.projectCategoryId}
                    onChange={handleChange}
                    placeholder="Select category..."
                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange}
                    />
                    <Input
                        label="End Date (empty if ongoing)"
                        name="endDate"
                        type="date"
                        value={form.endDate}
                        onChange={handleChange}
                    />
                </div>
                <Input
                    label="GitHub URL"
                    name="githubUrl"
                    type="url"
                    value={form.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    maxLength={500}
                />
                <Input
                    label="Live URL"
                    name="liveUrl"
                    type="url"
                    value={form.liveUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    maxLength={500}
                />
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Skills Used ({profileSkillIds.length})
                    </label>
                    {availableSkills.length === 0 ? (
                        <p className="text-muted text-xs">
                            No skills available. Add skills from the Skills tab first.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {availableSkills.map((skill) => {
                                const selected = profileSkillIds.includes(skill.id);
                                return (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => handleSkillToggle(skill.id)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selected
                                            ? 'bg-accent text-white border border-accent'
                                            : 'bg-card border border-border text-muted hover:text-foreground hover:border-accent'
                                            }`}
                                    >
                                        {selected && '✓ '}
                                        {skill.skillName}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Image Gallery ({images.length})
                    </label>
                    <ProjectImagesManager images={images} onChange={setImages} />
                </div>
                <div className="space-y-2 pt-2 border-t border-border">
                    <Checkbox
                        label="Featured project"
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                    />
                    <Input
                        label="Display Order"
                        name="displayOrder"
                        type="number"
                        value={form.displayOrder.toString()}
                        onChange={handleChange}
                        min={0}
                    />
                </div>
                <div className="flex gap-3 pt-4 border-t border-border">
                    <Button type="submit" loading={loading} variant="primary">
                        {isEdit ? 'Save Changes' : 'Add Project'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}