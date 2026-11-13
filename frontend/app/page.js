import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import SectionHeading from "@/components/home/SectionHeading";
import CardGridSkeleton from "@/components/home/CardGridSkeleton";
import FeaturedTours from "@/components/home/FeaturedTours";
import PopularHotels from "@/components/home/PopularHotels";
import PopularDestinations from "@/components/home/PopularDestinations";

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      {/* Featured tours */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Handpicked for you"
            title="Featured"
            highlight="tour packages"
            text="Our most loved trips to the north, with hotels, transport and a local guide included."
            href="/tours"
            linkLabel="All tours"
          />
          <Suspense fallback={<CardGridSkeleton count={3} />}>
            <FeaturedTours />
          </Suspense>
        </div>
      </section>

      {/* Destinations */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <SectionHeading
            eyebrow="Where to next?"
            title="Explore"
            highlight="destinations"
            text="From the lakes of Hunza to the deserts of Skardu, pick a place and see its tours and sights."
            href="/destinations"
            linkLabel="All destinations"
          />
          <Suspense fallback={<CardGridSkeleton count={4} cols={4} />}>
            <PopularDestinations />
          </Suspense>
        </div>
      </section>

      {/* Popular hotels */}
      <section className="bg-green-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow="Stay in comfort"
            title="Popular"
            highlight="hotels"
            text="Trusted hotels and resorts in Hunza, Skardu, Naran, Murree and more, at the best rates."
            href="/hotels"
            linkLabel="All hotels"
          />
          <Suspense fallback={<CardGridSkeleton count={4} cols={4} />}>
            <PopularHotels />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
