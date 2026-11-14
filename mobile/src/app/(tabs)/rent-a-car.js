import { useLocalSearchParams } from "expo-router";
import ListScreen from "@/components/ListScreen";
import { VehicleCard } from "@/components/Cards";
import { VEHICLE_PRICES, param, priceFilter } from "@/lib/data";

const filters = [
  {
    key: "vehicle_type",
    label: "Vehicle type",
    options: [
      { label: "All vehicles", value: "" },
      { label: "Car", value: "car" },
      { label: "SUV", value: "suv" },
      { label: "Jeep", value: "jeep" },
      { label: "Van", value: "van" },
      { label: "Coaster", value: "coaster" },
      { label: "Bus", value: "bus" },
    ],
  },
  {
    key: "driver_option",
    label: "Driver",
    options: [
      { label: "Any", value: "" },
      { label: "With driver", value: "with_driver" },
      { label: "Self drive", value: "self_drive" },
      { label: "Driver or self drive", value: "both" },
    ],
  },
  {
    key: "min_seats",
    label: "Seats",
    options: [
      { label: "Any seats", value: "" },
      { label: "4+ seats", value: "4" },
      { label: "7+ seats", value: "7" },
      { label: "12+ seats", value: "12" },
      { label: "20+ seats", value: "20" },
    ],
  },
  priceFilter(VEHICLE_PRICES),
];

export default function RentACarScreen() {
  const p = useLocalSearchParams();
  return (
    <ListScreen
      endpoint="/api/vehicles/"
      hero={{
        title: "Rent a Car for",
        highlight: "Northern Areas",
        text: "Cars, SUVs, jeeps and coasters with experienced drivers who know the mountain roads.",
      }}
      searchPlaceholder="Car name…"
      filters={filters}
      initial={{ search: param(p.search), filters: {} }}
      noun="vehicle"
      emptyText="No vehicles found. Try changing the filters."
      renderCard={(v) => <VehicleCard vehicle={v} />}
    />
  );
}
