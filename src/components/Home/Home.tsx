export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to <span className="text-blue-600">Syrena</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We’re building something amazing. Stay tuned — exciting things are on
          the way!
        </p>
        <div className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white text-lg font-semibold shadow-md hover:bg-blue-700 transition">
          Content Coming Soon
        </div>
      </div>
    </main>
  );
}
