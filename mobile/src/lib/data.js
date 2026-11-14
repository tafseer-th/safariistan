import { useEffect, useState } from "react";
import { getJson } from "@/lib/api";

// Small lists used by several screens (filters, forms). Fetched once per app run.
const cache = {};

function useCachedList(path) {
  const [list, setList] = useState(cache[path] || []);
  useEffect(() => {
    if (cache[path]) return;
    let active = true;
    getJson(path)
      .then((data) => {
        cache[path] = Array.isArray(data) ? data : data.results;
        if (active) setList(cache[path]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [path]);
  return list;
}

export const useDestinations = () => useCachedList("/api/destinations/");
export const useLocations = () => useCachedList("/api/locations/");

// Price filter buckets — same as the website.
export const TOUR_PRICES = [
  { label: "Any price", min: "", max: "" },
  { label: "Under Rs 30,000", min: "", max: "29999" },
  { label: "Rs 30,000 – 60,000", min: "30000", max: "60000" },
  { label: "Rs 60,000+", min: "60000", max: "" },
];

export const HOTEL_PRICES = [
  { label: "Any price", min: "", max: "" },
  { label: "Under Rs 10,000", min: "", max: "9999" },
  { label: "Rs 10,000 – 20,000", min: "10000", max: "20000" },
  { label: "Rs 20,000 – 40,000", min: "20000", max: "40000" },
  { label: "Rs 40,000+", min: "40000", max: "" },
];

export const VEHICLE_PRICES = [
  { label: "Any price", min: "", max: "" },
  { label: "Under Rs 15,000", min: "", max: "14999" },
  { label: "Rs 15,000 – 30,000", min: "15000", max: "30000" },
  { label: "Rs 30,000+", min: "30000", max: "" },
];

// Turns a price bucket list into a filter definition for ListScreen.
export function priceFilter(buckets) {
  return {
    key: "price",
    label: "Price",
    options: buckets.map((b, i) => ({ label: b.label, value: i })),
    toQuery: (i) => ({ min_price: buckets[i]?.min || "", max_price: buckets[i]?.max || "" }),
  };
}

// Route params can be a string or an array; take the first value.
export function param(v) {
  return (Array.isArray(v) ? v[0] : v) || "";
}
