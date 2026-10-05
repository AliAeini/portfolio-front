import type { Profile } from '@/lib/types';

const services = [
    { icon: '🖥️', title: 'Website Development' },
    { icon: '📱', title: 'App Development' },
    { icon: '☁️', title: 'Website Hosting' },
];

const stats = [
    { value: '120+', label: 'Completed Projects' },
    { value: '95%', label: 'Client satisfaction' },
    { value: '10+', label: 'Years of experience' },
];

export function About({ profile }: { profile: Profile | null; }) {
    return (
        <section id="about" className="py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8 relative">
                        <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[#ff6b4a] to-transparent hidden md:block" />
                        {
                            services.map((service, index) => (
                                <div key={index} className="flex items-center gap-6 relative">
                                    <div className="w-16 h-16 rounded-lg bg-[#1a1d24] border border-[#2d333b] flex items-center justify-center text-2xl z-10">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-white font-semibold text-lg">{service.title}</h3>
                                </div>
                            ))
                        }
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">About me</h2>
                        <p className="text-gray-400 leading-relaxed">
                            {profile?.bio || 'I started my software journey from photography. Through that, I learned to love the process of creating from scratch. Since then, this has led me to software development as it fulfills my love for learning and building things.'}
                        </p>
                        <div className="grid grid-cols-3 gap-6 pt-4">
                            {
                                stats.map((stat) => (
                                    <div key={stat.label}>
                                        <div className="text-3xl md:text-4xl font-bold text-white">
                                            {stat.value.replace(/[+%]/, '')}
                                            <span className="text-[#ff6b4a]">{stat.value.match(/[+%]/)?.[0]}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}