import { useLocalSearchParams } from "expo-router";
import ListScreen from "@/components/ListScreen";
import { PlaceCard } from "@/components/Cards";
import { param, useDestinations } from "@/lib/data";

export default function SightseeingScreen() {
  const p = useLocalSearchParams();
  const destinations = useDestinations();

  const filters = [
    {
      key: "destination",
      label: "Destination",
      options: [{ label: "All destinations", value: "" }, ...destinations.map((d) => ({ label: d.name, value: d.slug }))],
    },
  ];

  return (
    <ListScreen
      endpoint="/api/sightseeing/"
      hero={{
        title: "Sightseeing in",
        highlight: "Northern Pakistan",
        text: "Lakes, forts, valleys, and scenic viewpoints. Choose your destinations and add them to your tour.",
      }}
      searchPlaceholder="Place or valley…"
      filters={filters}
      initial={{ search: param(p.search), filters: { destination: param(p.destination) } }}
      noun="place"
      emptyText="No places found. Try another destination."
      renderCard={(pl) => <PlaceCard place={pl} />}
    />
  );
}
