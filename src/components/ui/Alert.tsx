interface AlertProps {
    variant?: 'error' | 'success' | 'info';
    title?: string;
    messages: string[];
}

export function Alert({ variant = 'error', title, messages }: AlertProps) {
    if (messages.length === 0) return null;

    const styles = {
        error: 'bg-red-950/50 border-red-800 text-red-200',
        success: 'bg-green-950/50 border-green-800 text-green-200',
        info: 'bg-blue-950/50 border-blue-800 text-blue-200',
    };

    return (
        <div className={`border rounded-lg p-4 ${styles[variant]}`}>
            {title && <h3 className="font-semibold mb-2">{title}</h3>}
            <ul className="list-disc list-inside space-y-1 text-sm">
                {messages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}