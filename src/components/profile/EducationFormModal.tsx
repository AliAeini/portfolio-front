'use client';

import { useEffect, useState } from 'react';
import { educationApi } from '@/lib/educationApi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type {
    Education,
    DegreeLevel,
    CreateEducationRequest,
    UpdateEducationRequest,
} from '@/lib/types';

interface EducationFormModalProps {
    isOpen: boolean;
    profileId: string;
    education?: Education;
    degreeLevels: DegreeLevel[];
    onClose: () => void;
    onSuccess: (education: Education, isNew: boolean) => void;
}

export function EducationFormModal({
    isOpen,
    profileId,
    education,
    degreeLevels,
    onClose,
    onSuccess,
}: EducationFormModalProps) {
    const isEdit = !!education;

    const [form, setForm] = useState<CreateEducationRequest>({
        institution: '',
        degree: 11,
        field: '',
        startDate: '',
        endDate: '',
        description: '',
        location: '',
        grade: '',
        displayOrder: 0,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setForm({
                institution: education?.institution || '',
                degree: education?.degree || 11,
                field: education?.field || '',
                startDate: education?.startDate?.split('T')[0] || '',
                endDate: education?.endDate?.split('T')[0] || '',
                description: education?.description || '',
                location: education?.location || '',
                grade: education?.grade || '',
                displayOrder: education?.displayOrder || 0,
            });
        }
    }, [isOpen, education]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...form,
                degree: parseInt(form.degree.toString()),
                startDate: new Date(form.startDate).toISOString(),
                endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
                displayOrder: form.displayOrder || 0,
            };

            const res = isEdit
                ? await educationApi.update(profileId, education!.id, payload as UpdateEducationRequest)
                : await educationApi.create(profileId, payload);

            if (res.success && res.data) {
                onSuccess(res.data, !isEdit);
                onClose();
            }
        } catch {
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Education' : 'Add Education'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                    label="Institution"
                    name="institution"
                    value={form.institution}
                    onChange={handleChange}
                    placeholder="e.g., University of Tehran"
                    required
                    maxLength={200}
                />
                <Select
                    label="Degree"
                    name="degree"
                    value={form.degree.toString()}
                    onChange={(e) => setForm({ ...form, degree: parseInt(e.target.value) })}
                    placeholder="Select degree..."
                    options={degreeLevels.map((d) => ({
                        value: d.value.toString(),
                        label: d.name,
                    }))}
                    required
                />
                <Input
                    label="Field of Study"
                    name="field"
                    value={form.field}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                    required
                    maxLength={200}
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
                        label="End Date (leave empty if ongoing)"
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
                    placeholder="e.g., Tehran, Iran"
                    maxLength={200}
                />
                <Input
                    label="Grade"
                    name="grade"
                    value={form.grade || ''}
                    onChange={handleChange}
                    placeholder="e.g., 18.5/20"
                    maxLength={50}
                />
                <Textarea
                    label="Description"
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    rows={3}
                    maxLength={2000}
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
                        {isEdit ? 'Save Changes' : 'Add Education'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}