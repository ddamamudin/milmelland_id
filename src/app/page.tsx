export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <h1 className="text-6xl font-bold tracking-tight sm:text-7xl">
          milmelland
          <span className="text-amber-400">.id</span>
        </h1>

        <p className="max-w-md text-lg text-zinc-400">
          Something awesome is coming. Stay tuned.
        </p>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-4">
            <span className="text-2xl font-bold text-amber-400">01</span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Feature</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-4">
            <span className="text-2xl font-bold text-amber-400">02</span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Feature</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-4">
            <span className="text-2xl font-bold text-amber-400">03</span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Feature</span>
          </div>
        </div>

        <p className="mt-8 text-sm text-zinc-600">
          &copy; 2026 milmelland.id
        </p>
      </main>
    </div>
  );
}
