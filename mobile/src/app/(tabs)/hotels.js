import { useLocalSearchParams } from "expo-router";
import ListScreen from "@/components/ListScreen";
import { HotelCard } from "@/components/Cards";
import { HOTEL_PRICES, param, priceFilter, useLocations } from "@/lib/data";

export default function HotelsScreen() {
  const p = useLocalSearchParams();
  const locations = useLocations();

  const filters = [
    {
      key: "location",
      label: "Location",
      options: [{ label: "All locations", value: "" }, ...locations.map((l) => ({ label: l.name, value: l.slug }))],
    },
    {
      key: "hotel_type",
      label: "Type",
      options: [
        { label: "All types", value: "" },
        { label: "Guest House", value: "guest_house" },
        { label: "Hotel", value: "hotel" },
        { label: "Resort", value: "resort" },
      ],
    },
    {
      key: "category",
      label: "Category",
      options: [
        { label: "All categories", value: "" },
        { label: "Standard", value: "standard" },
        { label: "Deluxe", value: "deluxe" },
        { label: "Luxury", value: "luxury" },
      ],
    },
    priceFilter(HOTEL_PRICES),
  ];

  return (
    <ListScreen
      endpoint="/api/hotels/"
      hero={{
        title: "Best Hotels in Pakistan for",
        highlight: "Northern Areas",
        after: "Tourism",
        text: "From clean, standard rooms to scenic luxury properties, booked to fit your package and budget.",
      }}
      searchPlaceholder="Hotel name…"
      filters={filters}
      initial={{ search: param(p.search), filters: { location: param(p.location) } }}
      noun="hotel"
      emptyText="No hotels found. Try changing the filters."
      renderCard={(h) => <HotelCard hotel={h} />}
    />
  );
}
