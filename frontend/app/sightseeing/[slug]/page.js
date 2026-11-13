import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, CalendarDays, ChevronLeft, Check, Mountain } from "lucide-react";
import PlaceInquiryForm from "@/components/PlaceInquiryForm";
import { API_URL } from "@/lib/api";

async function getPlace(slug) {
  try {
    const res = await fetch(`${API_URL}/api/sightseeing/${slug}/`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("API error");
    return res.json();
  } catch {
    return undefined; // backend is not running
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const place = await getPlace(slug);
  return { title: place ? `${place.name} | Safaristan` : "Sightseeing | Safaristan" };
}

export default async function PlaceDetailPage({ params }) {
  const { slug } = await params;
  const place = await getPlace(slug);

  if (place === null) notFound();

  if (place === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 pt-20 text-center">
        <p className="text-red-600">Could not load this place. Is the backend server running?</p>
      </main>
    );
  }

  const photos = [
    ...(place.image ? [place.image] : []),
    ...place.images.map((i) => i.image),
  ];

  return (
    <main className="bg-white pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/sightseeing"
          className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline"
        >
          <ChevronLeft size={16} />
          All places
        </Link>

        <div className="mt-4">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{place.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin size={16} />
              {place.destination.name}
            </span>
            {place.best_time && (
              <span className="flex items-center gap-1">
                <CalendarDays size={16} />
                Best time: {place.best_time}
              </span>
            )}
          </p>
        </div>

        {/* Gallery */}
        <div className="mt-6 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          {photos.length === 0 ? (
            <div className="flex h-72 items-center justify-center rounded-3xl bg-green-50 text-green-300 md:col-span-4">
              <Mountain size={72} />
            </div>
          ) : (
            photos.slice(0, 5).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`${place.name} ${i + 1}`}
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
            {place.description && (
              <section>
                <h2 className="text-xl font-bold text-gray-900">About this place</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-600">
                  {place.description}
                </p>
              </section>
            )}

            {place.highlights.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">Highlights</h2>
                <ul className="mt-3 space-y-2">
                  {place.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check size={16} className="mt-0.5 shrink-0 text-green-600" />
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <PlaceInquiryForm placeName={place.name} destination={place.destination.name} />

            <div className="mt-4 grid gap-2">
                <Link
                  href={`/tours?destination=${place.destination.slug}`}
                  className="rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {place.destination.name} tours
                </Link>
                <Link
                  href="/hotels"
                  className="rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Hotels
                </Link>
                <Link
                  href="/rent-a-car"
                  className="rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Rent a car
                </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}