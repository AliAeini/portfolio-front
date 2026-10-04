'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import type { ApiResponse } from '@/lib/types';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
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
            const res = await authApi.login(form);
            if (res.success && res.data) {
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                router.push('/admin/profiles');
            } else {
                setErrors(res.errors || [res.message]);
            }
        } catch (err: unknown) {
            const apiErr = err as ApiResponse<unknown>;
            setErrors(apiErr?.errors || [apiErr?.message || 'Login failed']);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-100 mb-6">Login</h1>

                    {errors.length > 0 && (
                        <div className="mb-4">
                            <Alert variant="error" messages={errors} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <Button type="submit" loading={loading} className="w-full">
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}