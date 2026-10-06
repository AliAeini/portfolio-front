'use client';

import { useRef } from 'react';
import type { ProjectImageInput } from '@/lib/types';
import { fileHandler } from '@/utils/fileHandler';

interface ProjectImagesManagerProps {
    images: ProjectImageInput[];
    onChange: (images: ProjectImageInput[]) => void;
}

export function ProjectImagesManager({ images, onChange }: ProjectImagesManagerProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newImages: ProjectImageInput[] = Array.from(files).map((file, index) => {
            const previewUrl = URL.createObjectURL(file);

            return {
                id: null,
                imageUrl: null,
                file,
                previewUrl,
                caption: null,
                isCover: images.length === 0 && index === 0,
                displayOrder: images.length + index,
            };
        });

        onChange([...images, ...newImages]);

        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function handleRemove(index: number) {
        const imageToRemove = images[index];
        if (imageToRemove.previewUrl) {
            URL.revokeObjectURL(imageToRemove.previewUrl);
        }
        onChange(images.filter((_, i) => i !== index));
    }

    function handleSetCover(index: number) {
        onChange(images.map((img, i) => ({ ...img, isCover: i === index })));
    }

    function handleCaptionChange(index: number, caption: string) {
        onChange(images.map((img, i) => (i === index ? { ...img, caption } : img)));
    }

    function handleMoveUp(index: number) {
        if (index === 0) return;
        const updated = [...images];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        onChange(updated.map((img, i) => ({ ...img, displayOrder: i })));
    }

    function handleMoveDown(index: number) {
        if (index === images.length - 1) return;
        const updated = [...images];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        onChange(updated.map((img, i) => ({ ...img, displayOrder: i })));
    }

    function getImageUrl(image: ProjectImageInput): string {
        if (image.previewUrl) return image.previewUrl;
        if (image.imageUrl) return fileHandler({ url: image.imageUrl }) ?? '';
        return '';
    }

    return (
        <div className="space-y-4">
            <div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="project-images-input"
                />
                <label
                    htmlFor="project-images-input"
                    className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-100 border border-border text-sm"
                >
                    + Add Images
                </label>
                <p className="text-xs text-muted mt-1">
                    Allowed: JPG, PNG, WebP, GIF — Max 5MB each
                </p>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border rounded-lg overflow-hidden"
                        >
                            <div className="aspect-video bg-gray-800 relative">
                                <img
                                    src={getImageUrl(image)}
                                    alt={`Project image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {image.isCover && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-white text-xs rounded">
                                        Cover
                                    </span>
                                )}
                            </div>
                            <div className="p-3 space-y-2">
                                <input
                                    type="text"
                                    value={image.caption || ''}
                                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                                    placeholder="Caption (optional)"
                                    className="w-full px-2 py-1 text-xs bg-gray-900 border border-border rounded text-gray-100"
                                />
                                <div className="flex items-center justify-between gap-1">
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleMoveUp(index)}
                                            disabled={index === 0}
                                            className="px-2 py-1 text-xs bg-card hover:bg-card-hover border border-border rounded disabled:opacity-30"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleMoveDown(index)}
                                            disabled={index === images.length - 1}
                                            className="px-2 py-1 text-xs bg-card hover:bg-card-hover border border-border rounded disabled:opacity-30"
                                        >
                                            ↓
                                        </button>
                                        {!image.isCover && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetCover(index)}
                                                className="px-2 py-1 text-xs text-accent hover:text-accent-hover border border-border rounded"
                                            >
                                                Set Cover
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="px-2 py-1 text-xs text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}