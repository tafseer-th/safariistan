import Link from "next/link";
import { Users, Snowflake, Cog, UserCheck, Car } from "lucide-react";
import { formatPrice } from "@/lib/api";

export default function VehicleCard({ vehicle }) {
  const hasDiscount = vehicle.discount_percent > 0;

  return (
    <Link
      href={`/rent-a-car/${vehicle.slug}`}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-green-50">
        {vehicle.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-green-300">
            <Car size={56} />
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
            {vehicle.discount_percent}% off
          </span>
        )}

        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-green-700 shadow">
          {vehicle.vehicle_type_display}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-bold text-gray-900 group-hover:text-green-700">
          {vehicle.name}
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Users size={15} className="text-green-600" />
            {vehicle.seats} seats
          </span>
          <span className="flex items-center gap-1.5">
            <Cog size={15} className="text-green-600" />
            {vehicle.transmission_display}
          </span>
          <span className="flex items-center gap-1.5">
            <Snowflake size={15} className="text-green-600" />
            {vehicle.has_ac ? "AC" : "No AC"}
          </span>
          <span className="flex items-center gap-1.5">
            <UserCheck size={15} className="text-green-600" />
            {vehicle.driver_option === "self_drive"
              ? "Self drive"
              : vehicle.driver_option === "both"
              ? "Driver / Self"
              : "With driver"}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-xs text-gray-400">Per day</p>
            <p className="text-lg font-extrabold text-green-700">
              {formatPrice(vehicle.discounted_price)}
            </p>
          </div>
          {hasDiscount && (
            <p className="text-sm text-gray-400 line-through">
              {formatPrice(vehicle.price_per_day)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}