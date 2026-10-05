'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

export function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // TODO: ارسال به backend
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setForm({ name: '', email: '', message: '' });
    }

    return (
        <section id="contact" className="py-24 border-t border-[#2d333b]">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
                <div className="space-y-6">
                    <p className="text-gray-400 text-sm flex items-center gap-3">
                        <span className="w-8 h-px bg-[#ff6b4a]" />
                        Contacts
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Have a project?
                        <br />
                        Let&apos;s talk!
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <Textarea
                        label="Message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                        required
                    />
                    {submitted && (
                        <p className="text-green-400 text-sm">Message sent successfully!</p>
                    )}
                    <Button type="submit" variant="primary">
                        Submit
                    </Button>
                </form>
            </div>
        </section>
    );
}