'use client';

import { useEffect, useState } from 'react';
import { experienceApi } from '@/lib/experienceApi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type {
    Experience,
    EmploymentType,
    CreateExperienceRequest,
    UpdateExperienceRequest,
} from '@/lib/types';

interface ExperienceFormModalProps {
    isOpen: boolean;
    profileId: string;
    experience?: Experience;
    employmentTypes: EmploymentType[];
    onClose: () => void;
    onSuccess: (experience: Experience, isNew: boolean) => void;
}

export function ExperienceFormModal({
    isOpen,
    profileId,
    experience,
    employmentTypes,
    onClose,
    onSuccess,
}: ExperienceFormModalProps) {
    const isEdit = !!experience;

    const [form, setForm] = useState<CreateExperienceRequest>({
        company: '',
        position: '',
        employmentType: 1,
        startDate: '',
        endDate: '',
        description: '',
        location: '',
        companyUrl: '',
        displayOrder: 0,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setForm({
                company: experience?.company || '',
                position: experience?.position || '',
                employmentType: experience?.employmentType || 1,
                startDate: experience?.startDate?.split('T')[0] || '',
                endDate: experience?.endDate?.split('T')[0] || '',
                description: experience?.description || '',
                location: experience?.location || '',
                companyUrl: experience?.companyUrl || '',
                displayOrder: experience?.displayOrder || 0,
            });
        }
    }, [isOpen, experience]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;

        if (name === 'employmentType' || name === 'displayOrder') {
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
                ...form,
                employmentType: parseInt(form.employmentType.toString()),
                displayOrder: form.displayOrder || 0,
                startDate: new Date(form.startDate).toISOString(),
                endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
            };

            const res = isEdit
                ? await experienceApi.update(profileId, experience!.id, payload as UpdateExperienceRequest)
                : await experienceApi.create(profileId, payload);

            if (res.success && res.data) {
                onSuccess(res.data, !isEdit);
                onClose();
            }
        } catch {
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Experience' : 'Add Experience'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                    label="Company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g., Google"
                    required
                    maxLength={200}
                />
                <Input
                    label="Position"
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="e.g., Senior Software Engineer"
                    required
                    maxLength={200}
                />
                <Select
                    label="Employment Type"
                    name="employmentType"
                    value={form.employmentType.toString()}
                    onChange={(e) => setForm({ ...form, employmentType: parseInt(e.target.value) })}
                    placeholder="Select type..."
                    options={employmentTypes.map((t) => ({
                        value: t.value.toString(),
                        label: t.name,
                    }))}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="End Date (empty if current)"
                        name="endDate"
                        type="date"
                        value={form.endDate || ''}
                        onChange={handleChange}
                    />
                </div>
                <Input
                    label="Location"
                    name="location"
                    value={form.location || ''}
                    onChange={handleChange}
                    placeholder="e.g., Mountain View, CA"
                    maxLength={200}
                />
                <Input
                    label="Company URL"
                    name="companyUrl"
                    type="url"
                    value={form.companyUrl || ''}
                    onChange={handleChange}
                    placeholder="https://google.com"
                    maxLength={500}
                />
                <Textarea
                    label="Description"
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    placeholder="What did you do there?"
                    rows={4}
                    maxLength={3000}
                />
                <Input
                    label="Display Order"
                    name="displayOrder"
                    type="number"
                    value={form.displayOrder?.toString() || '0'}
                    onChange={handleChange}
                    min={0}
                />
                <div className="flex gap-3 pt-4 border-t border-border">
                    <Button type="submit" loading={loading} variant="primary">
                        {isEdit ? 'Save Changes' : 'Add Experience'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}