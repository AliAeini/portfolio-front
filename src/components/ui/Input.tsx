interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
    const inputId = id || props.name;
    return (
        <div>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1.5">
                {label}
                {props.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
                id={inputId}
                {...props}
                className={`
          w-full px-3 py-2 rounded-lg
          bg-gray-900 border border-gray-700
          text-gray-100 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
    );
}