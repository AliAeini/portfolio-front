const projects = [
    {
        title: 'Battleship',
        tags: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
        description:
            'Used components of JavaScript to implement basic data structures through the game of Battleship. Used a terminal to display ships and tracked where ships are hit or missed.',
        image: null,
        codeUrl: '#',
        demoUrl: '#',
        reverse: false,
    },
    {
        title: 'Movie Titles API',
        tags: ['HTML', 'CSS', 'JavaScript', 'API', 'Version control'],
        description:
            'Uses a public movie API to build a collection movie list that sorts from A to Z or vice versa. It also counts how many movies in each container and adds user\'s favorite movies into another container.',
        image: null,
        codeUrl: '#',
        demoUrl: '#',
        reverse: true,
    },
    {
        title: 'JavaScript Calculator',
        tags: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
        description:
            'Uses simple algorithm concepts in JavaScript to produce an arithmetic result in a terminal.',
        image: null,
        codeUrl: '#',
        demoUrl: '#',
        reverse: false,
    },
    {
        title: 'SaaS Landing Page',
        tags: ['HTML', 'CSS'],
        description:
            'Used HTML concepts such as creating a form and a basic skeleton. It also used components of both the grid and flexbox elements to produce a landing page.',
        image: null,
        codeUrl: '#',
        demoUrl: '#',
        reverse: true,
    },
];

export function Projects() {
    return (
        <section id="projects" className="py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Projects</h2>
                    <div className="w-px h-16 bg-[#ff6b4a] mx-auto" />
                </div>
                <div className="space-y-24">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className={`grid md:grid-cols-2 gap-12 items-center ${project.reverse ? 'md:flex-row-reverse' : ''}`}
                        >
                            <div className={`space-y-4 ${project.reverse ? 'md:order-2' : ''}`}>
                                <h3 className="text-2xl md:text-3xl font-bold text-white">
                                    {project.title}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 text-xs bg-[#1a1d24] border border-[#2d333b] text-gray-300 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {project.description}
                                </p>
                                <div className="flex gap-3 pt-2">
                                    <a
                                        href={project.codeUrl}
                                        className="px-5 py-2 bg-[#ff6b4a] hover:bg-[#ff5533] text-white rounded text-sm font-medium transition-colors"
                                    >
                                        View Github
                                    </a>
                                    <a
                                        href={project.demoUrl}
                                        className="px-5 py-2 text-white text-sm font-medium hover:text-[#ff6b4a] transition-colors flex items-center gap-1"
                                    >
                                        View project ↗
                                    </a>
                                </div>
                            </div>
                            <div className={`${project.reverse ? 'md:order-1' : ''}`}>
                                <div className="aspect-video bg-[#1a1d24] border border-[#2d333b] rounded-lg flex items-center justify-center text-gray-600">
                                    {
                                        project.image ? (
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <span className="text-sm">Project Preview</span>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}