import Link from "next/link";
import { MapPin, Hotel as HotelIcon } from "lucide-react";
import { formatPrice } from "@/lib/api";

export default function HotelCard({ hotel }) {
  const hasDiscount = hotel.discount_percent > 0;

  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden bg-green-50">
        {hotel.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hotel.image}
            alt={hotel.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-green-300">
            <HotelIcon size={56} />
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
            {hotel.discount_percent}% off
          </span>
        )}

        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-green-700 shadow">
          {hotel.category_display}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-bold text-gray-900 group-hover:text-green-700">
          {hotel.name}
        </h3>

        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} />
          {hotel.location?.name} · {hotel.hotel_type_display}
        </p>

        <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-xs text-gray-400">Start from</p>
            <p className="text-lg font-extrabold text-green-700">
              {formatPrice(hotel.discounted_price)}
              <span className="text-xs font-medium text-gray-500">/night</span>
            </p>
          </div>
          {hasDiscount && (
            <p className="text-sm text-gray-400 line-through">
              {formatPrice(hotel.price_from)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}