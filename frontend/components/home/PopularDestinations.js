import DestinationCard from "@/components/DestinationCard";
import SectionError from "@/components/home/SectionError";
import fetchJson from "@/components/home/fetchJson";

// Popular destinations in a mosaic: the first one is shown bigger.
export default async function PopularDestinations({ limit = 8 }) {
  let list = await fetchJson("/api/destinations/?is_popular=true");
  if (list && list.length === 0) list = await fetchJson("/api/destinations/");
  if (!list) return <SectionError what="Destinations" />;

  // Destinations with the most tours first
  const items = [...list]
    .sort((a, b) => b.tour_count + b.place_count - (a.tour_count + a.place_count))
    .slice(0, limit);
  if (items.length === 0) return null;

  return (
    <div className="mt-8 grid auto-rows-[14rem] gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((d, i) => (
        <DestinationCard
          key={d.id}
          destination={d}
          large={i === 0}
          className={i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}
        />
      ))}
    </div>
  );
}
