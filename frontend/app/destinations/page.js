import DestinationCard from "@/components/DestinationCard";
import { API_URL } from "@/lib/api";

export const metadata = {
  title: "Destinations in Pakistan | Safaristan",
  description:
    "Explore Hunza, Skardu, Naran Kaghan, Swat, Fairy Meadows and more with Safaristan tours.",
};

async function getDestinations() {
  try {
    const res = await fetch(`${API_URL}/api/destinations/`, { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    return res.json();
  } catch {
    return undefined;
  }
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <main className="bg-white pt-20">
      <section className="border-b border-gray-100 bg-green-50/60">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Our <span className="text-green-600">Destinations</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            The most beautiful places in Pakistan. Pick a destination to see its
            tours and sightseeing spots.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {destinations === undefined && (
          <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">
            Destinations could not be loaded. Please try again later.
          </div>
        )}

        {destinations && destinations.length === 0 && (
          <div className="rounded-2xl bg-gray-50 p-12 text-center text-gray-500">
            No destinations yet.
          </div>
        )}

        {destinations && destinations.length > 0 && (
          <div className="grid auto-rows-[15rem] gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {destinations.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}