import Link from "next/link";
import { MapPin, CalendarDays, Mountain } from "lucide-react";

export default function PlaceCard({ place }) {
  return (
    <Link
      href={`/sightseeing/${place.slug}`}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden bg-green-50">
        {place.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={place.image}
            alt={place.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-green-300">
            <Mountain size={56} />
          </div>
        )}

        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-green-700 shadow">
          <MapPin size={12} />
          {place.destination.name}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-bold text-gray-900 group-hover:text-green-700">
          {place.name}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-gray-500">
          {place.short_description}
        </p>
        {place.best_time && (
          <p className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
            <CalendarDays size={14} className="text-green-600" />
            Best time: {place.best_time}
          </p>
        )}
      </div>
    </Link>
  );
}