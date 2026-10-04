'use client';

import { useState, useRef } from 'react';
import { Alert } from '@/components/ui/Alert';
import { fileHandler } from '@/utils/fileHandler';

interface AvatarUploaderProps {
    currentAvatarUrl?: string | null;
    selectedFile: File | null;
    onFileSelected: (file: File | null) => void;
}

export function AvatarUploader({
    currentAvatarUrl,
    selectedFile,
    onFileSelected,
}: AvatarUploaderProps) {
    const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
    const [errors, setErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            setErrors([`File type '${file.type}' is not allowed.`]);
            return;
        }

        if (file.size > maxSize) {
            setErrors(['File size exceeds 5 MB.']);
            return;
        }

        setErrors([]);
        onFileSelected(file);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    function handleRemove() {
        setPreview(currentAvatarUrl || null);
        onFileSelected(null);
        setErrors([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const imageProfile = fileHandler({ url: preview });

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">Avatar</label>

            <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                    {imageProfile ? (
                        <img src={imageProfile} alt="Avatar preview" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-500 text-xs">No image</span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="avatar-input"
                    />
                    <label
                        htmlFor="avatar-input"
                        className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 text-sm"
                    >
                        {preview ? 'Change Image' : 'Select Image'}
                    </label>

                    {selectedFile && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-xs text-red-400 hover:text-red-300"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>

            <p className="text-xs text-gray-500">
                Allowed: JPG, PNG, WebP, GIF — Max 5MB
            </p>

            {errors.length > 0 && <Alert variant="error" messages={errors} />}
        </div>
    );
}