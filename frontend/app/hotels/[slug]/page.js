import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Users, ChevronLeft, Hotel as HotelIcon } from "lucide-react";
import HotelInquiryForm from "@/components/HotelInquiryForm";
import { API_URL, formatPrice } from "@/lib/api";

async function getHotel(slug) {
  try {
    const res = await fetch(`${API_URL}/api/hotels/${slug}/`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("API error");
    return res.json();
  } catch {
    return undefined; // backend band hai
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const hotel = await getHotel(slug);
  return {
    title: hotel ? `${hotel.name} | Safaristan` : "Hotel | Safaristan",
  };
}

export default async function HotelDetailPage({ params }) {
  const { slug } = await params;
  const hotel = await getHotel(slug);

  if (hotel === null) notFound();

  if (hotel === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 pt-20 text-center">
        <p className="text-red-600">
          Hotel load nahi ho saka. Backend server chal raha hai?
        </p>
      </main>
    );
  }

  const hasDiscount = hotel.discount_percent > 0;
  const photos = [
    ...(hotel.image ? [hotel.image] : []),
    ...hotel.images.map((i) => i.image),
  ];

  return (
    <main className="bg-white pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/hotels"
          className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline"
        >
          <ChevronLeft size={16} />
          Sab hotels
        </Link>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {hotel.name}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-gray-600">
              <MapPin size={16} />
              {hotel.address || hotel.location?.name}
              <span className="rounded-full bg-green-50 px-3 py-0.5 text-xs font-semibold text-green-700">
                {hotel.hotel_type_display}
              </span>
              <span className="rounded-full bg-green-50 px-3 py-0.5 text-xs font-semibold text-green-700">
                {hotel.category_display}
              </span>
            </p>
          </div>

          <div className="text-right">
            {hasDiscount && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                {hotel.discount_percent}% off
              </span>
            )}
            <p className="mt-2 text-xs text-gray-400">Start from</p>
            <p className="text-3xl font-extrabold text-green-700">
              {formatPrice(hotel.discounted_price)}
              <span className="text-sm font-medium text-gray-500">/night</span>
            </p>
            {hasDiscount && (
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(hotel.price_from)}
              </p>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-6 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          {photos.length === 0 ? (
            <div className="flex h-72 items-center justify-center rounded-3xl bg-green-50 text-green-300 md:col-span-4">
              <HotelIcon size={72} />
            </div>
          ) : (
            photos.slice(0, 5).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`${hotel.name} ${i + 1}`}
                className={`w-full rounded-2xl object-cover ${
                  i === 0
                    ? "h-72 md:col-span-2 md:row-span-2 md:h-full"
                    : "h-36 md:h-full"
                }`}
              />
            ))
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {/* Left: details + rooms */}
          <div className="lg:col-span-2">
            {hotel.description && (
              <section>
                <h2 className="text-xl font-bold text-gray-900">About this stay</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-600">
                  {hotel.description}
                </p>
              </section>
            )}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-gray-900">Rooms</h2>

              {hotel.rooms.length === 0 ? (
                <p className="mt-3 rounded-2xl bg-gray-50 p-6 text-gray-500">
                  Room details jaldi add hongi. Rates ke liye WhatsApp par poochho.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {hotel.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 sm:flex-row"
                    >
                      {room.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={room.image}
                          alt={room.name}
                          className="h-36 w-full rounded-xl object-cover sm:w-48"
                        />
                      )}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">{room.name}</h3>
                          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                            <Users size={14} />
                            Up to {room.capacity} guests
                          </p>
                          {room.description && (
                            <p className="mt-2 text-sm text-gray-600">{room.description}</p>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-lg font-extrabold text-green-700">
                            {formatPrice(room.price_per_night)}
                            <span className="text-xs font-medium text-gray-500">/night</span>
                          </p>
                          {!room.is_available && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                              Not available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right: inquiry form */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <HotelInquiryForm hotelName={hotel.name} location={hotel.location?.name} />
          </div>
        </div>
      </div>
    </main>
  );
}