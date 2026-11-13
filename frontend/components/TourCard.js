import Link from "next/link";
import { MapPin, Clock, Compass } from "lucide-react";
import { formatPrice } from "@/lib/api";

export default function TourCard({ tour }) {
  const hasDiscount = tour.discount_percent > 0;

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden bg-green-50">
        {tour.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tour.image}
            alt={tour.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-green-300">
            <Compass size={56} />
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
            {tour.discount_percent}% off
          </span>
        )}

        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-green-700 shadow">
          {tour.category_display}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[3rem] text-base font-bold text-gray-900 group-hover:text-green-700">
          {tour.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {tour.duration_label}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            From {tour.departure_city_display}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-xs text-gray-400">Per person</p>
            <p className="text-lg font-extrabold text-green-700">
              {formatPrice(tour.discounted_price)}
            </p>
          </div>
          {hasDiscount && (
            <p className="text-sm text-gray-400 line-through">
              {formatPrice(tour.price_per_person)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}