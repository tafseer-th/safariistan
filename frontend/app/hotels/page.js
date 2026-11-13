import { Suspense } from "react";
import HotelsExplorer from "@/components/HotelsExplorer";

export const metadata = {
  title: "Best Hotels in Pakistan's Northern Areas | Safaristan",
  description:
    "Hotels, resorts and guest houses in Hunza, Skardu, Naran Kaghan, Swat and more. Standard to luxury stays.",
};

export default function HotelsPage() {
  return (
    <main className="bg-white pt-20">
      <section className="border-b border-gray-100 bg-green-50/60">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Best Hotels in Pakistan for{" "}
            <span className="text-green-600">Northern Areas</span> Tourism
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            We book accommodations according to your package and budget, ranging from clean, standard rooms to scenic luxury properties.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Suspense fallback={<p className="py-20 text-center text-gray-400">Loading…</p>}>
          <HotelsExplorer />
        </Suspense>
      </section>
    </main>
  );
}