interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    return (
        <div
            className={`
        ${sizeClasses[size]}
        border-accent border-t-transparent
        rounded-full animate-spin
        mx-auto mt-[20vh]
        ${className}
      `}
            role="status"
            aria-label="Loading"
        />
    );
}