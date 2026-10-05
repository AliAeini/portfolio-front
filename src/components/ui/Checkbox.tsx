interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
}

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
    const checkboxId = id || props.name;

    return (
        <label htmlFor={checkboxId} className="flex items-center gap-2 cursor-pointer">
            <input
                id={checkboxId}
                type="checkbox"
                {...props}
                className={`
          w-4 h-4 rounded
          bg-gray-900 border border-gray-700
          text-blue-600
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
          cursor-pointer
          ${className}
        `}
            />
            <span className="text-sm text-gray-300">{label}</span>
        </label>
    );
}