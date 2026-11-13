import HotelCard from "@/components/HotelCard";
import SectionError from "@/components/home/SectionError";
import { fetchFeatured } from "@/components/home/fetchJson";

// Hotels marked "Is featured" in the admin.
export default async function PopularHotels({ limit = 8 }) {
  const data = await fetchFeatured("/api/hotels/");
  if (!data) return <SectionError what="Hotels" />;

  const hotels = data.results.slice(0, limit);
  if (hotels.length === 0) return null;

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
