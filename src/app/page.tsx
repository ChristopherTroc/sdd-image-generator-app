export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Next.js
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern, production-ready application with TypeScript and Tailwind CSS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              TypeScript
            </h2>
            <p className="text-gray-600">
              Full type safety with TypeScript strict mode enabled
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Tailwind CSS
            </h2>
            <p className="text-gray-600">
              Utility-first CSS framework for rapid UI development
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              ESLint & Prettier
            </h2>
            <p className="text-gray-600">
              Automated code quality and formatting tools
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
