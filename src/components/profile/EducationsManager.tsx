'use client';

import { useEffect, useState } from 'react';
import { educationApi } from '@/lib/educationApi';
import { lookupApi } from '@/lib/lookupApi';
import { Button } from '@/components/ui/Button';
import { EducationFormModal } from './EducationFormModal';
import type { Education, DegreeLevel } from '@/lib/types';

interface EducationsManagerProps {
    profileId: string;
}

export function EducationsManager({ profileId }: EducationsManagerProps) {
    const [educations, setEducations] = useState<Education[]>([]);
    const [degreeLevels, setDegreeLevels] = useState<DegreeLevel[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [profileId]);

    async function loadData() {
        try {
            setLoading(true);

            const [educationsRes, degreesRes] = await Promise.all([
                educationApi.getByProfile(profileId),
                lookupApi.getDegreeLevels(),
            ]);

            if (educationsRes.success && educationsRes.data) {
                setEducations(educationsRes.data);
            }

            if (degreesRes.success && degreesRes.data) {
                setDegreeLevels(degreesRes.data);
            }
        } finally {
            setLoading(false);
        }
    }

    function handleAddClick() {
        setEditingEducation(null);
        setShowModal(true);
    }

    function handleEditClick(education: Education) {
        setEditingEducation(education);
        setShowModal(true);
    }

    function handleFormSuccess(education: Education, isNew: boolean) {
        if (isNew) {
            setEducations([education, ...educations]);
        } else {
            setEducations(educations.map((e) => (e.id === education.id ? education : e)));
        }
    }

    async function handleDelete(education: Education) {
        if (!confirm(`Delete "${education.institution}"?`)) return;

        try {
            const res = await educationApi.delete(profileId, education.id);
            if (res.success) {
                setEducations(educations.filter((e) => e.id !== education.id));
            }
        } catch {
        }
    }

    function formatDateRange(start: string, end: string | null): string {
        const startDate = new Date(start).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        });
        const endDate = end
            ? new Date(end).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
            : 'Present';
        return `${startDate} — ${endDate}`;
    }

    if (loading) {
        return <div className="text-muted text-center py-12">Loading educations...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-foreground">
                        Education ({educations.length})
                    </h2>
                    <p className="text-muted text-sm mt-1">
                        Your academic background
                    </p>
                </div>
                <Button onClick={handleAddClick} variant="primary">
                    + Add Education
                </Button>
            </div>
            {educations.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <p className="text-muted mb-4">No education added yet.</p>
                    <Button onClick={handleAddClick} variant="primary">
                        Add your first education
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {educations.map((education) => (
                        <div
                            key={education.id}
                            className="bg-card border border-border rounded-lg p-5 flex gap-4"
                        >
                            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                                <span className="text-2xl">🎓</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-foreground font-semibold">
                                            {education.institution}
                                        </h3>
                                        <p className="text-accent text-sm mt-0.5">
                                            {education.degreeName} in {education.field}
                                        </p>
                                        <p className="text-muted text-xs mt-1">
                                            {formatDateRange(education.startDate, education.endDate)}
                                            {education.location && ` • ${education.location}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => handleEditClick(education)}
                                            className="text-accent hover:text-accent-hover text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(education)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {education.grade && (
                                    <p className="text-muted text-sm mt-2">
                                        <span className="text-foreground">Grade:</span> {education.grade}
                                    </p>
                                )}

                                {education.description && (
                                    <p className="text-muted text-sm mt-2">{education.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <EducationFormModal
                isOpen={showModal}
                profileId={profileId}
                education={editingEducation || undefined}
                degreeLevels={degreeLevels}
                onClose={() => setShowModal(false)}
                onSuccess={handleFormSuccess}
            />
        </div>
    );
}