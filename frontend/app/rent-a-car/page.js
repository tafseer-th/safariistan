import { Suspense } from "react";
import VehiclesExplorer from "@/components/VehiclesExplorer";

export const metadata = {
  title: "Rent a Car in Pakistan | Safaristan",
  description:
    "Rent cars, SUVs, jeeps, vans and coasters with driver for northern areas trips, airport transfers and tours.",
};

export default function RentACarPage() {
  return (
    <main className="bg-white pt-20">
      <section className="border-b border-gray-100 bg-green-50/60">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Rent a Car <span className="text-green-600">in Pakistan</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Choose from cars, SUVs, jeeps, vans, or coasters, with or without a driver. Select the vehicle that best suits your trip and get a quote via WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Suspense fallback={<p className="py-20 text-center text-gray-400">Loading…</p>}>
          <VehiclesExplorer />
        </Suspense>
      </section>
    </main>
  );
}