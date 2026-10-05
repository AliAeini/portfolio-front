const techs = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'React', 'Git', 'Github'];

export function TechStrip() {
    return (
        <section className="border-y border-[#2d333b] py-6 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between gap-6 text-gray-500 text-sm font-medium">
                {
                    techs.map((tech) => (
                        <span key={tech} className="hover:text-[#ff6b4a] transition-colors cursor-default">
                            {tech}
                        </span>
                    ))
                }
            </div>
        </section>
    );
}