import { profileApi } from '@/lib/api';
import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { TechStrip } from '@/components/sections/TechStrip';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export default async function HomePage() {
    let profile = null;
    try {
        const res = await profileApi.getById("a4c151f7-a190-4db0-a4a1-3bb7e376ff65");
        if (res.success && res.data && res.data.id) {
            profile = res.data
        }
    } catch {
        // ignore
    }

    return (
        <main className="min-h-screen bg-[#0f1419]">
            <Navbar />
            <Hero profile={profile} />
            <TechStrip />
            <About profile={profile} />
            <Projects />
            <Contact />
            <Footer />
        </main>
    );
}