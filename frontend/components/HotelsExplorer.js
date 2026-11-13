"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import HotelCard from "./HotelCard";
import { API_URL } from "@/lib/api";

const PAGE_SIZE = 12;

const priceRanges = [
  { label: "Any price", min: "", max: "" },
  { label: "Under Rs 10,000", min: "", max: "9999" },
  { label: "Rs 10,000 – 20,000", min: "10000", max: "20000" },
  { label: "Rs 20,000 – 40,000", min: "20000", max: "40000" },
  { label: "Rs 40,000+", min: "40000", max: "" },
];

const selectClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

export default function HotelsExplorer() {
  const params = useSearchParams();

  const [searchInput, setSearchInput] = useState(params.get("search") || "");
  const [filters, setFilters] = useState({
    search: params.get("search") || "",
    location: params.get("location") || "",
    hotel_type: "",
    category: "",
    price: 0,
  });
  const [page, setPage] = useState(1);

  const [locations, setLocations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    // URL badle (jaise home page se search) to filters bhi badal jayen
  const urlSearch = params.get("search") || "";
  const urlLocation = params.get("location") || "";
  useEffect(() => {
    setSearchInput(urlSearch);
    setFilters((f) => ({ ...f, search: urlSearch, location: urlLocation }));
    setPage(1);
  }, [urlSearch, urlLocation]);

  // Locations dropdown
  useEffect(() => {
    fetch(`${API_URL}/api/locations/`)
      .then((r) => r.json())
      .then(setLocations)
      .catch(() => {});
  }, []);

  // Search box: 0.4 sec ruk kar filter lagao
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Hotels fetch
  useEffect(() => {
    let active = true; // ignore late answers after filters change
    const range = priceRanges[filters.price];

    const q = new URLSearchParams();
    q.set("page", page);
    if (filters.search) q.set("search", filters.search);
    if (filters.location) q.set("location", filters.location);
    if (filters.hotel_type) q.set("hotel_type", filters.hotel_type);
    if (filters.category) q.set("category", filters.category);
    if (range.min) q.set("min_price", range.min);
    if (range.max) q.set("max_price", range.max);

    setLoading(true);
    setError("");

    fetch(`${API_URL}/api/hotels/?${q.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Server error");
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        setHotels(data.results);
        setCount(data.count);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("Hotels load nahi ho sake. Backend server chal raha hai?");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters, page]);

  const setFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const resetAll = () => {
    setSearchInput("");
    setFilters({ search: "", location: "", hotel_type: "", category: "", price: 0 });
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const from = count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, count);

  return (
    <div>
      {/* Filter bar */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-lg">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Search
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Hotel name…"
                className={`${selectClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => setFilter("location", e.target.value)}
              className={selectClass}
            >
              <option value="">All locations</option>
              {locations.map((l) => (
                <option key={l.id} value={l.slug}>
                  Hotels in {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Type
            </label>
            <select
              value={filters.hotel_type}
              onChange={(e) => setFilter("hotel_type", e.target.value)}
              className={selectClass}
            >
              <option value="">All types</option>
              <option value="guest_house">Guest House</option>
              <option value="hotel">Hotel</option>
              <option value="resort">Resort</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilter("category", e.target.value)}
              className={selectClass}
            >
              <option value="">All categories</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Price
            </label>
            <select
              value={filters.price}
              onChange={(e) => setFilter("price", Number(e.target.value))}
              className={selectClass}
            >
              {priceRanges.map((p, i) => (
                <option key={p.label} value={i}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-gray-500">
            {loading ? "Loading…" : `Showing ${from}–${to} of ${count} hotels`}
          </p>
          <button
            onClick={resetAll}
            className="font-semibold text-green-700 hover:underline"
          >
            Reset filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">{error}</div>
        )}

        {loading && !error && (
          <div className="flex justify-center py-20 text-green-600">
            <Loader2 className="animate-spin" size={36} />
          </div>
        )}

        {!loading && !error && hotels.length === 0 && (
          <div className="rounded-2xl bg-gray-50 p-12 text-center text-gray-500">
            Koi hotel nahi mila. Filters badal ke dekho.
          </div>
        )}

        {!loading && !error && hotels.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hotels.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage((p) => p - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => {
              setPage((p) => p + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}