'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const links = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contacts' },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f1419]/95 backdrop-blur border-b border-[#2d333b]' : 'bg-transparent'}`}
        >
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-white font-semibold text-lg">
                    Portfolio<span className="text-[#ff6b4a]">.</span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-gray-300 hover:text-[#ff6b4a] text-sm transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
                <Link
                    href="/login"
                    className="text-xs text-gray-400 hover:text-[#ff6b4a] transition-colors"
                >
                    Admin
                </Link>
            </div>
        </nav>
    );
}