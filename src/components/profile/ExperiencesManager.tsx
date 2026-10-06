'use client';

import { useEffect, useState } from 'react';
import { experienceApi } from '@/lib/experienceApi';
import { lookupApi } from '@/lib/lookupApi';
import { Button } from '@/components/ui/Button';
import { ExperienceFormModal } from './ExperienceFormModal';
import type { Experience, EmploymentType } from '@/lib/types';
import { Spinner } from '../ui/Spinner';

export function ExperiencesManager({ profileId }: { profileId: string; }) {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [employmentTypes, setEmploymentTypes] = useState<EmploymentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [profileId]);

    async function loadData() {
        try {
            setLoading(true);

            const [experiencesRes, typesRes] = await Promise.all([
                experienceApi.getByProfile(profileId),
                lookupApi.getEmploymentTypes(),
            ]);

            if (experiencesRes.success && experiencesRes.data) setExperiences(experiencesRes.data);
            if (typesRes.success && typesRes.data) setEmploymentTypes(typesRes.data);
        } finally {
            setLoading(false);
        }
    }

    function handleAddClick() {
        setEditingExperience(null);
        setShowModal(true);
    }

    function handleEditClick(experience: Experience) {
        setEditingExperience(experience);
        setShowModal(true);
    }

    function handleFormSuccess(experience: Experience, isNew: boolean) {
        if (isNew) {
            setExperiences([experience, ...experiences]);
        } else {
            setExperiences(experiences.map((e) => (e.id === experience.id ? experience : e)));
        }
    }

    async function handleDelete(experience: Experience) {
        if (!confirm(`Delete "${experience.position}" at "${experience.company}"?`)) return;

        try {
            const res = await experienceApi.delete(profileId, experience.id);
            if (res.success) {
                setExperiences(experiences.filter((e) => e.id !== experience.id));
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

    function formatEmploymentType(name: string): string {
        return name.replace(/([A-Z])/g, ' $1').trim();
    }

    if (loading) return <Spinner />

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-foreground">
                        Experience ({experiences.length})
                    </h2>
                    <p className="text-muted text-sm mt-1">Your professional background</p>
                </div>
                <Button onClick={handleAddClick} variant="primary">
                    + Add Experience
                </Button>
            </div>
            {experiences.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <p className="text-muted mb-4">No experience added yet.</p>
                    <Button onClick={handleAddClick} variant="primary">
                        Add your first experience
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {experiences.map((experience) => (
                        <div
                            key={experience.id}
                            className="bg-card border border-border rounded-lg p-5 flex gap-4"
                        >
                            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                                <span className="text-2xl">💼</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-foreground font-semibold">{experience.position}</h3>
                                        <p className="text-accent text-sm mt-0.5">{experience.company}</p>
                                        <p className="text-muted text-xs mt-1">
                                            {formatDateRange(experience.startDate, experience.endDate)}
                                            {experience.location && ` • ${experience.location}`}
                                            {experience.employmentTypeName && ` • ${formatEmploymentType(experience.employmentTypeName)}`}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => handleEditClick(experience)}
                                            className="text-accent hover:text-accent-hover text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(experience)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {experience.description && (
                                    <p className="text-muted text-sm mt-2">{experience.description}</p>
                                )}

                                {experience.companyUrl && (
                                    <a
                                        href={experience.companyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:underline text-xs mt-2 inline-block"
                                    >
                                        {experience.companyUrl} ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ExperienceFormModal
                isOpen={showModal}
                profileId={profileId}
                experience={editingExperience || undefined}
                employmentTypes={employmentTypes}
                onClose={() => setShowModal(false)}
                onSuccess={handleFormSuccess}
            />
        </div>
    );
}