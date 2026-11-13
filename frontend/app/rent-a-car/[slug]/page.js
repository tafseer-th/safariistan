import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Check, Users, Snowflake, Cog, UserCheck, Car } from "lucide-react";
import VehicleInquiryForm from "@/components/VehicleInquiryForm";
import { API_URL, formatPrice } from "@/lib/api";

async function getVehicle(slug) {
  try {
    const res = await fetch(`${API_URL}/api/vehicles/${slug}/`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("API error");
    return res.json();
  } catch {
    return undefined; // backend band hai
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  return { title: vehicle ? `Rent ${vehicle.name} | Safaristan` : "Rent a Car | Safaristan" };
}

export default async function VehicleDetailPage({ params }) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (vehicle === null) notFound();

  if (vehicle === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 pt-20 text-center">
        <p className="text-red-600">Gari load nahi ho saki. Backend server chal raha hai?</p>
      </main>
    );
  }

  const hasDiscount = vehicle.discount_percent > 0;

  const specs = [
    { icon: Users, label: "Seats", value: `${vehicle.seats} seats` },
    { icon: Cog, label: "Transmission", value: vehicle.transmission_display },
    { icon: Snowflake, label: "Air conditioning", value: vehicle.has_ac ? "AC" : "No AC" },
    { icon: UserCheck, label: "Driver", value: vehicle.driver_option_display },
  ];

  return (
    <main className="bg-white pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/rent-a-car"
          className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline"
        >
          <ChevronLeft size={16} />
          Sab gariyan
        </Link>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{vehicle.name}</h1>
            <p className="mt-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {vehicle.vehicle_type_display}
              </span>
            </p>
          </div>

          <div className="text-right">
            {hasDiscount && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                {vehicle.discount_percent}% off
              </span>
            )}
            <p className="mt-2 text-xs text-gray-400">Per day</p>
            <p className="text-3xl font-extrabold text-green-700">
              {formatPrice(vehicle.discounted_price)}
            </p>
            {hasDiscount && (
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(vehicle.price_per_day)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2">
            {vehicle.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="h-80 w-full rounded-3xl object-cover sm:h-[28rem]"
              />
            ) : (
              <div className="flex h-72 items-center justify-center rounded-3xl bg-green-50 text-green-300">
                <Car size={80} />
              </div>
            )}

            {/* Specs */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-gray-200 p-4 text-center">
                  <Icon size={22} className="mx-auto text-green-600" />
                  <p className="mt-2 text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            {vehicle.description && (
              <section className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">About this vehicle</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-600">
                  {vehicle.description}
                </p>
              </section>
            )}

            {vehicle.features.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">Features</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {vehicle.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check size={16} className="mt-0.5 shrink-0 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <VehicleInquiryForm vehicleName={vehicle.name} />
          </div>
        </div>
      </div>
    </main>
  );
}