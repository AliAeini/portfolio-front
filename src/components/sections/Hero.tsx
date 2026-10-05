import type { Profile } from '@/lib/types';
import { fileHandler } from '@/utils/fileHandler';

interface HeroProps {
    profile: Profile | null;
}

export function Hero({ profile }: HeroProps) {
    const avatarUrl = fileHandler({ url: profile?.avatarUrl });

    return (
        <section
            id="home"
            className="min-h-screen flex items-center pt-20 relative overflow-hidden"
        >
            <div className="absolute top-32 left-10 opacity-20 hidden lg:block">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M0 0 L60 0 L60 60" stroke="#ff6b4a" strokeWidth="2" />
                </svg>
            </div>
            <div className="absolute top-32 right-10 opacity-20 hidden lg:block">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M0 0 L0 60 L60 60" stroke="#ff6b4a" strokeWidth="2" />
                </svg>
            </div>
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
                <div className="space-y-6">
                    <p className="text-gray-300 text-lg">
                        Hello <span className="text-[#ff6b4a]">•</span>
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        <span className="text-white">I&apos;m</span>{' '}
                        <span className="text-white">
                            {profile?.fullName}
                        </span>
                    </h1>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        {profile?.bio?.split('.')[0] || 'Software Developer'}
                    </h2>
                    <p className="text-gray-400 max-w-md">
                        {profile?.bio || 'Building digital experiences with modern web technologies.'}
                    </p>
                    <div className="flex gap-4 pt-4">
                        <a
                            href="#contact"
                            className="px-6 py-3 bg-[#ff6b4a] hover:bg-[#ff5533] text-white rounded-lg font-medium text-sm transition-colors"
                        >
                            Got a project?
                        </a>
                        <a
                            href="#projects"
                            className="px-6 py-3 border border-[#ff6b4a] text-[#ff6b4a] hover:bg-[#ff6b4a]/10 rounded-lg font-medium text-sm transition-colors"
                        >
                            My resume
                        </a>
                    </div>
                </div>
                <div className="flex justify-center items-center relative">
                    <div className="relative">
                        <div className="w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-[#ff6b4a]/30 flex items-center justify-center relative">
                            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-[#1a1d24] border-4 border-[#ff6b4a]">
                                {
                                    avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={profile?.fullName || 'Avatar'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-6xl">
                                            👤
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}