import { Suspense } from "react";
import PlacesExplorer from "@/components/PlacesExplorer";

export const metadata = {
  title: "Sightseeing in Pakistan's Northern Areas | Safaristan",
  description:
    "Lakes, forts, valleys and viewpoints in Hunza, Skardu, Naran Kaghan, Swat and more. Plan your sightseeing with Safaristan.",
};

export default function SightseeingPage() {
  return (
    <main className="bg-white pt-20">
      <section className="border-b border-gray-100 bg-green-50/60">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Sightseeing in <span className="text-green-600">Northern Pakistan</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Lakes, forts, valleys, and scenic viewpoints. Choose your destinations and add them to your tour.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Suspense fallback={<p className="py-20 text-center text-gray-400">Loading…</p>}>
          <PlacesExplorer />
        </Suspense>
      </section>
    </main>
  );
}