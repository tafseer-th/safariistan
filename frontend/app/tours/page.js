import { Suspense } from "react";
import ToursExplorer from "@/components/ToursExplorer";

export const metadata = {
  title: "Tour Packages for Pakistan's Northern Areas | Safaristan",
  description:
    "Hunza, Skardu, Naran Kaghan, Swat, Fairy Meadows and more. Honeymoon, family and group tour packages from Lahore, Islamabad and Karachi.",
};

export default function ToursPage() {
  return (
    <main className="bg-white pt-20">
      <section className="border-b border-gray-100 bg-green-50/60">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Tour Packages for <span className="text-green-600">Northern Pakistan</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Ready-made packages with transport, hotels and a local guide. Pick a destination, tour type and departure city.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Suspense fallback={<p className="py-20 text-center text-gray-400">Loading…</p>}>
          <ToursExplorer />
        </Suspense>
      </section>
    </main>
  );
}
