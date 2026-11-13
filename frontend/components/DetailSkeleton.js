// Placeholder shown while a detail page (hotel, tour, car, place) loads.
export default function DetailSkeleton() {
  return (
    <main className="bg-white pt-20" aria-busy="true" aria-label="Loading">
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="mt-5 h-9 w-2/3 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-1/3 rounded bg-gray-100" />
        <div className="mt-6 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          <div className="h-72 rounded-2xl bg-gray-200 md:col-span-2 md:row-span-2 md:h-80" />
          <div className="hidden h-full rounded-2xl bg-gray-100 md:block" />
          <div className="hidden h-full rounded-2xl bg-gray-100 md:block" />
          <div className="hidden h-full rounded-2xl bg-gray-100 md:block" />
          <div className="hidden h-full rounded-2xl bg-gray-100 md:block" />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <div className="h-6 w-40 rounded bg-gray-200" />
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
          </div>
          <div className="h-80 rounded-3xl bg-gray-100" />
        </div>
      </div>
    </main>
  );
}
