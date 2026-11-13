import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, ChevronLeft, Check, X, Compass, Users } from "lucide-react";
import TourInquiryForm from "@/components/TourInquiryForm";
import { API_URL, formatPrice } from "@/lib/api";

async function getTour(slug) {
  try {
    const res = await fetch(`${API_URL}/api/tours/${slug}/`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("API error");
    return res.json();
  } catch {
    return undefined; // backend is not running
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tour = await getTour(slug);
  return {
    title: tour ? `${tour.title} | Safaristan` : "Tour | Safaristan",
    description: tour?.summary || undefined,
  };
}

export default async function TourDetailPage({ params }) {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (tour === null) notFound();

  if (tour === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 pt-20 text-center">
        <p className="text-red-600">Could not load this tour. Is the backend server running?</p>
      </main>
    );
  }

  const hasDiscount = tour.discount_percent > 0;
  const photos = [
    ...(tour.image ? [tour.image] : []),
    ...tour.images.map((i) => i.image),
  ];

  return (
    <main className="bg-white pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/tours"
          className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline"
        >
          <ChevronLeft size={16} />
          All tours
        </Link>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              {tour.category_display}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">{tour.title}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {tour.destination.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {tour.duration_label}
              </span>
              <span className="flex items-center gap-1">
                <Users size={16} />
                From {tour.departure_city_display}
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">Per person</p>
            <p className="text-3xl font-extrabold text-green-700">
              {formatPrice(tour.discounted_price)}
            </p>
            {hasDiscount && (
              <p className="text-sm">
                <span className="text-gray-400 line-through">{formatPrice(tour.price_per_person)}</span>{" "}
                <span className="font-bold text-red-500">{tour.discount_percent}% off</span>
              </p>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-6 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          {photos.length === 0 ? (
            <div className="flex h-72 items-center justify-center rounded-3xl bg-green-50 text-green-300 md:col-span-4">
              <Compass size={72} />
            </div>
          ) : (
            photos.slice(0, 5).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`${tour.title} ${i + 1}`}
                className={`w-full rounded-2xl object-cover ${
                  i === 0 ? "h-72 md:col-span-2 md:row-span-2 md:h-full" : "h-36 md:h-full"
                }`}
              />
            ))
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2">
            {(tour.description || tour.summary) && (
              <section>
                <h2 className="text-xl font-bold text-gray-900">Overview</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-600">
                  {tour.description || tour.summary}
                </p>
              </section>
            )}

            {tour.itinerary.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">Itinerary</h2>
                <ol className="mt-4 space-y-4 border-l-2 border-green-100 pl-6">
                  {tour.itinerary.map((d) => (
                    <li key={d.id} className="relative">
                      <span className="absolute -left-[2.15rem] flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                        {d.day_number}
                      </span>
                      <p className="font-semibold text-gray-900">
                        Day {d.day_number}: {d.title}
                      </p>
                      {d.description && (
                        <p className="mt-1 whitespace-pre-line text-sm text-gray-600">{d.description}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {(tour.inclusions.length > 0 || tour.exclusions.length > 0) && (
              <section className="mt-8 grid gap-6 sm:grid-cols-2">
                {tour.inclusions.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Included</h2>
                    <ul className="mt-3 space-y-2">
                      {tour.inclusions.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check size={16} className="mt-0.5 shrink-0 text-green-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.exclusions.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Not included</h2>
                    <ul className="mt-3 space-y-2">
                      {tour.exclusions.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <X size={16} className="mt-0.5 shrink-0 text-red-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <TourInquiryForm tourTitle={tour.title} destination={tour.destination.name} />
          </div>
        </div>
      </div>
    </main>
  );
}
