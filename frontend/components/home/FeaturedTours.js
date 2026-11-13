import TourCard from "@/components/TourCard";
import SectionError from "@/components/home/SectionError";
import { fetchFeatured } from "@/components/home/fetchJson";

// Tours marked "Is featured" in the admin.
export default async function FeaturedTours({ limit = 6 }) {
  const data = await fetchFeatured("/api/tours/");
  if (!data) return <SectionError what="Tours" />;

  const tours = data.results.slice(0, limit);
  if (tours.length === 0) return null;

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
