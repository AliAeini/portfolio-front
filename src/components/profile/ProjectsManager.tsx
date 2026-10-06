'use client';

import { useEffect, useState } from 'react';
import { projectApi } from '@/lib/projectApi';
import { Button } from '@/components/ui/Button';
import { ProjectFormModal } from './ProjectFormModal';
import type { Project } from '@/lib/types';
import { Spinner } from '../ui/Spinner';
import { fileHandler } from '@/utils/fileHandler';

interface ProjectsManagerProps {
    profileId: string;
}

export function ProjectsManager({ profileId }: ProjectsManagerProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadProjects();
    }, [profileId]);

    async function loadProjects() {
        try {
            setLoading(true);
            const res = await projectApi.getByProfile(profileId);
            if (res.success && res.data) setProjects(res.data);
        } finally {
            setLoading(false);
        }
    }

    function handleAdd() {
        setEditingProject(null);
        setShowModal(true);
    }

    function handleEdit(project: Project) {
        setEditingProject(project);
        setShowModal(true);
    }

    function handleFormSuccess(project: Project, isNew: boolean) {
        if (isNew) {
            setProjects([project, ...projects]);
        } else {
            setProjects(projects.map((p) => (p.id === project.id ? project : p)));
        }
        loadProjects();
    }

    async function handleDelete(project: Project) {
        if (!confirm(`Delete "${project.title}"?`)) return;
        try {
            const res = await projectApi.delete(profileId, project.id);
            if (res.success) setProjects(projects.filter((p) => p.id !== project.id));
        } catch {
            // interceptor
        }
    }

    function getCoverImage(project: Project): string | null {
        const cover = project.images.find((img) => img.isCover) ?? project.images[0];
        return cover ? fileHandler({ url: cover.imageUrl }) : null;
    }

    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-foreground">
                        Projects ({projects.length})
                    </h2>
                    <p className="text-muted text-sm mt-1">Your work showcase</p>
                </div>
                <Button onClick={handleAdd} variant="primary">
                    + Add Project
                </Button>
            </div>
            {projects.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <p className="text-muted mb-4">No projects added yet.</p>
                    <Button onClick={handleAdd} variant="primary">
                        Add your first project
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => {
                        const cover = getCoverImage(project);
                        return (
                            <div
                                key={project.id}
                                className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors"
                            >
                                <div className="aspect-video bg-gray-800 relative">
                                    {cover ? (
                                        <img src={cover} alt={project.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted">
                                            <span className="text-4xl">📁</span>
                                        </div>
                                    )}
                                    {project.isFeatured && (
                                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-accent text-white text-xs rounded">
                                            ⭐ Featured
                                        </span>
                                    )}
                                </div>
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="text-foreground font-semibold">{project.title}</h3>
                                        {project.projectCategoryName && (
                                            <p className="text-accent text-xs mt-0.5">{project.projectCategoryName}</p>
                                        )}
                                    </div>
                                    <p className="text-muted text-sm line-clamp-2">
                                        {project.shortDescription || project.description}
                                    </p>
                                    {project.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {project.skills.slice(0, 4).map((skill) => (
                                                <span
                                                    key={skill.id}
                                                    className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded"
                                                >
                                                    {skill.skillName}
                                                </span>
                                            ))}
                                            {project.skills.length > 4 && (
                                                <span className="text-muted text-xs">+{project.skills.length - 4}</span>
                                            )}
                                        </div>
                                    )}
                                    {project.images.length > 0 && (
                                        <p className="text-muted text-xs">🖼️ {project.images.length} image(s)</p>
                                    )}
                                    <div className="flex gap-2 pt-2 border-t border-border">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="text-accent hover:text-accent-hover text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            Delete
                                        </button>
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted hover:text-foreground text-sm ml-auto"
                                            >
                                                GitHub ↗
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-accent hover:underline text-sm"
                                            >
                                                Live ↗
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <ProjectFormModal
                isOpen={showModal}
                profileId={profileId}
                project={editingProject || undefined}
                onClose={() => setShowModal(false)}
                onSuccess={handleFormSuccess}
            />
        </div>
    );
}