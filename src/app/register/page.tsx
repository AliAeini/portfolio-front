'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        try {
            await register(form);
            router.push('/dashboard/profile');
        } catch (err: unknown) {
            const error = err as Error;
            setErrors([error.message || 'Registration failed']);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Create Account
                    </h1>
                    <p className="text-muted text-sm mb-6">
                        Start building your portfolio
                    </p>
                    {errors.length > 0 && (
                        <div className="mb-4">
                            <Alert variant="error" messages={errors} />
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="e.g., Ali Aeini"
                            required
                            maxLength={200}
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            required
                            minLength={8}
                        />
                        <Button type="submit" loading={loading} className="w-full">
                            Sign Up
                        </Button>
                    </form>
                    <p className="text-center text-sm text-muted mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-accent hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}