export default function Home() {
    return (
        <main className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-gray-100 mb-4">
                    Welcome to My Portfolio
                </h1>
                <p className="text-gray-400 mb-8">Coming soon...</p>
                <a
                    href="/admin/profiles"
                    className="text-blue-400 hover:text-blue-300 underline"
                >
                    Admin Panel →
                </a>
            </div>
        </main>
    );
}