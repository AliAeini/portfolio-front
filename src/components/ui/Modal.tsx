'use client';

import { useEffect, ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
}

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
};

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    if (!isOpen) return null;

    function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-card border border-border rounded-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col shadow-2xl`}
            >
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                        {title && (
                            <h2 className="text-xl font-bold text-foreground">{title}</h2>
                        )}
                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="text-muted hover:text-foreground transition-colors text-2xl leading-none ml-auto"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}