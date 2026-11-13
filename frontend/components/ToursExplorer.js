"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import TourCard from "./TourCard";
import { API_URL } from "@/lib/api";

const PAGE_SIZE = 12;

const priceRanges = [
  { label: "Any price", min: "", max: "" },
  { label: "Under Rs 30,000", min: "", max: "29999" },
  { label: "Rs 30,000 – 60,000", min: "30000", max: "60000" },
  { label: "Rs 60,000+", min: "60000", max: "" },
];

const selectClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500";

export default function ToursExplorer() {
  const params = useSearchParams();

  const urlSearch = params.get("search") || "";
  const urlDestination = params.get("destination") || "";
  const urlCategory = params.get("category") || "";
  const urlDeparture = params.get("from") || "";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [filters, setFilters] = useState({
    search: urlSearch,
    destination: urlDestination,
    category: urlCategory,
    departure: urlDeparture,
    price: 0,
  });
  const [page, setPage] = useState(1);

  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // URL badle (navbar / home page se) to filters bhi badal jayen
  useEffect(() => {
    setSearchInput(urlSearch);
    setFilters((f) => ({
      ...f,
      search: urlSearch,
      destination: urlDestination,
      category: urlCategory,
      departure: urlDeparture,
    }));
    setPage(1);
  }, [urlSearch, urlDestination, urlCategory, urlDeparture]);

  // Destinations dropdown
  useEffect(() => {
    fetch(`${API_URL}/api/destinations/`)
      .then((r) => r.json())
      .then(setDestinations)
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

  // Tours fetch
  useEffect(() => {
    let active = true; // ignore late answers after filters change
    const range = priceRanges[filters.price];

    const q = new URLSearchParams();
    q.set("page", page);
    if (filters.search) q.set("search", filters.search);
    if (filters.destination) q.set("destination", filters.destination);
    if (filters.category) q.set("category", filters.category);
    if (filters.departure) q.set("departure", filters.departure);
    if (range.min) q.set("min_price", range.min);
    if (range.max) q.set("max_price", range.max);

    setLoading(true);
    setError("");

    fetch(`${API_URL}/api/tours/?${q.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Server error");
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        setTours(data.results);
        setCount(data.count);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("Tours load nahi ho sake. Backend server chal raha hai?");
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
    setFilters({ search: "", destination: "", category: "", departure: "", price: 0 });
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
          <div>
            <label className={labelClass}>Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tour or place…"
                className={`${selectClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Destination</label>
            <select
              value={filters.destination}
              onChange={(e) => setFilter("destination", e.target.value)}
              className={selectClass}
            >
              <option value="">All destinations</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Tour type</label>
            <select
              value={filters.category}
              onChange={(e) => setFilter("category", e.target.value)}
              className={selectClass}
            >
              <option value="">All types</option>
              <option value="standard">Standard</option>
              <option value="honeymoon">Honeymoon</option>
              <option value="family">Family</option>
              <option value="group">Group</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Departure from</label>
            <select
              value={filters.departure}
              onChange={(e) => setFilter("departure", e.target.value)}
              className={selectClass}
            >
              <option value="">Any city</option>
              <option value="lahore">Lahore</option>
              <option value="islamabad">Islamabad</option>
              <option value="karachi">Karachi</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Price</label>
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
            {loading ? "Loading…" : `Showing ${from}–${to} of ${count} tours`}
          </p>
          <button onClick={resetAll} className="font-semibold text-green-700 hover:underline">
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

        {!loading && !error && tours.length === 0 && (
          <div className="rounded-2xl bg-gray-50 p-12 text-center text-gray-500">
            Koi tour nahi mila. Filters badal ke dekho.
          </div>
        )}

        {!loading && !error && tours.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tours.map((t) => (
              <TourCard key={t.id} tour={t} />
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