'use client';

import { useEffect, useState } from 'react';
import { profileSkillApi, skillApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import type {
    ProfileSkill,
    GroupedSkills,
    ApiResponse,
} from '@/lib/types';

interface ProfileSkillsManagerProps {
    profileId: string;
}

export function ProfileSkillsManager({ profileId }: ProfileSkillsManagerProps) {
    const [mySkills, setMySkills] = useState<ProfileSkill[]>([]);
    const [availableSkills, setAvailableSkills] = useState<GroupedSkills[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [profileId]);

    async function loadData() {
        try {
            setLoading(true);
            setErrors([]);

            const [mySkillsRes, availableRes] = await Promise.all([
                profileSkillApi.getByProfile(profileId),
                skillApi.getGrouped(),
            ]);

            if (mySkillsRes.success && mySkillsRes.data) {
                setMySkills(mySkillsRes.data);
            }

            if (availableRes.success && availableRes.data) {
                setAvailableSkills(availableRes.data);
            }
        } catch (err: unknown) {
            const apiErr = err as ApiResponse<unknown>;
            setErrors(apiErr?.errors || [apiErr?.message || 'Failed to load skills']);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddSkill(skillId: string) {
        try {
            setErrors([]);
            const res = await profileSkillApi.add(profileId, { skillId, level: 50 });

            if (res.success && res.data) {
                setMySkills([...mySkills, res.data]);
                setSuccess('Skill added');
                setTimeout(() => setSuccess(null), 2000);
            } else {
                setErrors(res.errors || [res.message]);
            }
        } catch (err: unknown) {
            const apiErr = err as ApiResponse<unknown>;
            setErrors(apiErr?.errors || [apiErr?.message || 'Failed to add skill']);
        }
    }

    async function handleUpdateLevel(profileSkillId: string, level: number) {
        try {
            const res = await profileSkillApi.update(profileId, profileSkillId, {
                level,
                displayOrder: 0,
            });

            if (res.success && res.data) {
                setMySkills(mySkills.map((s) => (s.id === profileSkillId ? res.data! : s)));
            } else {
                setErrors(res.errors || [res.message]);
            }
        } catch (err: unknown) {
            const apiErr = err as ApiResponse<unknown>;
            setErrors(apiErr?.errors || [apiErr?.message || 'Failed to update']);
        }
    }

    async function handleRemove(profileSkillId: string, skillName: string) {
        if (!confirm(`Remove "${skillName}"?`)) return;

        try {
            await profileSkillApi.delete(profileId, profileSkillId);
            setMySkills(mySkills.filter((s) => s.id !== profileSkillId));
            setSuccess('Skill removed');
            setTimeout(() => setSuccess(null), 2000);
        } catch (err: unknown) {
            const apiErr = err as ApiResponse<unknown>;
            setErrors(apiErr?.errors || [apiErr?.message || 'Failed to remove']);
        }
    }

    function isAdded(skillId: string): boolean {
        return mySkills.some((s) => s.skillId === skillId);
    }

    const filteredSkills =
        selectedCategory === 'all'
            ? availableSkills
            : availableSkills.filter((c) => c.categoryId === selectedCategory);

    if (loading) {
        return <div className="text-muted text-center py-12">Loading skills...</div>;
    }

    return (
        <div className="space-y-8">
            {errors.length > 0 && <Alert variant="error" messages={errors} />}
            {success && <Alert variant="success" messages={[success]} />}
            <div>
                <h2 className="text-xl font-bold text-foreground mb-4">
                    My Skills ({mySkills.length})
                </h2>

                {mySkills.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-8 text-center text-muted">
                        No skills added yet. Add some from below!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mySkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="bg-card border border-border rounded-lg p-4 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-foreground font-medium">
                                            {skill.skillName}
                                        </h3>
                                        {skill.categoryName && (
                                            <p className="text-muted text-xs">{skill.categoryName}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRemove(skill.id, skill.skillName)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted">
                                        <span>Level</span>
                                        <span className="text-accent font-medium">{skill.level}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={skill.level}
                                        onChange={(e) =>
                                            handleUpdateLevel(skill.id, parseInt(e.target.value))
                                        }
                                        className="w-full accent-accent"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Add Skills</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-1.5 rounded-full text-xs transition-colors ${selectedCategory === 'all'
                                ? 'bg-accent text-white'
                                : 'bg-card border border-border text-muted hover:text-foreground'
                            }`}
                    >
                        All
                    </button>
                    {availableSkills.map((cat) => (
                        <button
                            key={cat.categoryId}
                            onClick={() => setSelectedCategory(cat.categoryId)}
                            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${selectedCategory === cat.categoryId
                                    ? 'bg-accent text-white'
                                    : 'bg-card border border-border text-muted hover:text-foreground'
                                }`}
                        >
                            {cat.categoryName} ({cat.skills.length})
                        </button>
                    ))}
                </div>
                <div className="space-y-6">
                    {filteredSkills.map((category) => (
                        <div key={category.categoryId}>
                            <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                                {category.categoryName}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill) => {
                                    const added = isAdded(skill.id);
                                    return (
                                        <button
                                            key={skill.id}
                                            disabled={added}
                                            onClick={() => handleAddSkill(skill.id)}
                                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${added
                                                    ? 'bg-accent/20 text-accent cursor-not-allowed border border-accent'
                                                    : 'bg-card border border-border text-muted hover:text-foreground hover:border-accent'
                                                }`}
                                        >
                                            {added && '✓ '}
                                            {skill.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}