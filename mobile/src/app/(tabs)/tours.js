import { useLocalSearchParams } from "expo-router";
import ListScreen from "@/components/ListScreen";
import { TourCard } from "@/components/Cards";
import { TOUR_PRICES, param, priceFilter, useDestinations } from "@/lib/data";

export default function ToursScreen() {
  const p = useLocalSearchParams();
  const destinations = useDestinations();

  const filters = [
    {
      key: "destination",
      label: "Destination",
      options: [{ label: "All destinations", value: "" }, ...destinations.map((d) => ({ label: d.name, value: d.slug }))],
    },
    {
      key: "category",
      label: "Tour type",
      options: [
        { label: "All types", value: "" },
        { label: "Standard", value: "standard" },
        { label: "Honeymoon", value: "honeymoon" },
        { label: "Family", value: "family" },
        { label: "Group", value: "group" },
      ],
    },
    {
      key: "departure",
      label: "Departure from",
      options: [
        { label: "Any city", value: "" },
        { label: "From Lahore", value: "lahore" },
        { label: "From Islamabad", value: "islamabad" },
        { label: "From Karachi", value: "karachi" },
      ],
    },
    priceFilter(TOUR_PRICES),
  ];

  return (
    <ListScreen
      endpoint="/api/tours/"
      hero={{
        title: "Tour Packages for",
        highlight: "Northern Pakistan",
        text: "Ready-made packages with transport, hotels and a local guide.",
      }}
      searchPlaceholder="Tour or place…"
      filters={filters}
      initial={{
        search: param(p.search),
        filters: { destination: param(p.destination), category: param(p.category), departure: param(p.from) },
      }}
      noun="tour"
      emptyText="No tours found. Try changing the filters."
      renderCard={(t) => <TourCard tour={t} />}
    />
  );
}
