// Grey placeholder cards shown while a home section loads.
export default function CardGridSkeleton({ count = 3, cols = 3 }) {
  return (
    <div
      className={`mt-8 grid animate-pulse gap-6 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-gray-100">
          <div className="h-52 bg-gray-200" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-4/5 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-100" />
            <div className="h-6 w-1/3 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
