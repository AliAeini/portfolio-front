interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: string;
}

export function Select({ label, options, placeholder, error, id, className = '', ...props }: SelectProps) {
    const selectId = id || props.name;

    return (
        <div>
            <label htmlFor={selectId} className="block text-sm font-medium text-gray-300 mb-1.5">
                {label}
                {props.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <select
                id={selectId}
                {...props}
                className={`
          w-full px-3 py-2 rounded-lg
          bg-gray-900 border border-gray-700
          text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
            >
                {placeholder && (
                    <option value="">{placeholder}</option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
    );
}