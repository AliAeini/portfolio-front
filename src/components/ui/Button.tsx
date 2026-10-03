interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
}

export function Button({
    variant = 'primary',
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseClasses =
        'px-5 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };

    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`${baseClasses} ${variants[variant]} ${className}`}
        >
            {loading ? 'Please wait...' : children}
        </button>
    );
}