// Placeholder grid shown while destinations load from the backend.
export default function Loading() {
  return (
    <main className="bg-white pt-20" aria-busy="true" aria-label="Loading">
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-14 sm:px-6">
        <div className="mx-auto h-10 w-64 rounded bg-gray-200" />
        <div className="mx-auto mt-4 h-4 w-96 max-w-full rounded bg-gray-100" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-gray-100" />
          ))}
        </div>
      </div>
    </main>
  );
}
