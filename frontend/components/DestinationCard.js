import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

// Photo card for a destination. `large` makes it fill a bigger grid cell.
export default function DestinationCard({ destination: d, large = false, className = "" }) {
  const counts = [
    d.tour_count > 0 && plural(d.tour_count, "tour"),
    d.place_count > 0 && plural(d.place_count, "place"),
  ].filter(Boolean);

  return (
    <div
      className={`group relative h-full min-h-56 overflow-hidden rounded-2xl bg-green-900 shadow-sm transition hover:shadow-xl ${className}`}
    >
      {d.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={d.image}
          alt={d.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-700 to-green-900 text-green-500/40">
          <MapPin size={large ? 96 : 64} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Whole card opens the destination's tours */}
      <Link href={`/tours?destination=${d.slug}`} className="absolute inset-0" aria-label={`${d.name} tours`} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        <h3 className={`font-extrabold text-white ${large ? "text-3xl" : "text-xl"}`}>{d.name}</h3>
        {counts.length > 0 && <p className="mt-1 text-sm text-white/80">{counts.join(" · ")}</p>}

        <div className="pointer-events-auto mt-3 flex gap-2">
          <Link
            href={`/tours?destination=${d.slug}`}
            className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50"
          >
            Tours <ArrowRight size={13} />
          </Link>
          <Link
            href={`/sightseeing?destination=${d.slug}`}
            className="rounded-full border border-white/60 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
          >
            Places
          </Link>
        </div>
      </div>
    </div>
  );
}
