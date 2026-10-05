export function Footer() {
    return (
        <footer className="py-12 border-t border-[#2d333b]">
            <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
                <h3 className="text-white font-semibold">Portfolio</h3>
                <p className="text-gray-500 text-xs">
                    Designed with love, all right reserved for Portfolio.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    {['mail', 'github', 'linkedin'].map((social) => (
                        <a
                            key={social}
                            href="#"
                            className="w-10 h-10 rounded-full bg-[#1a1d24] border border-[#2d333b] flex items-center justify-center text-gray-400 hover:text-[#ff6b4a] hover:border-[#ff6b4a] transition-colors"
                        >
                            <span className="text-xs uppercase">{social[0]}</span>
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}