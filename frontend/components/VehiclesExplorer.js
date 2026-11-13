"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import VehicleCard from "./VehicleCard";
import { API_URL } from "@/lib/api";

const PAGE_SIZE = 12;

const priceRanges = [
  { label: "Any price", min: "", max: "" },
  { label: "Under Rs 15,000", min: "", max: "14999" },
  { label: "Rs 15,000 – 30,000", min: "15000", max: "30000" },
  { label: "Rs 30,000+", min: "30000", max: "" },
];

const seatOptions = [
  { label: "Any seats", value: "" },
  { label: "4+ seats", value: "4" },
  { label: "7+ seats", value: "7" },
  { label: "12+ seats", value: "12" },
  { label: "20+ seats", value: "20" },
];

const selectClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500";

export default function VehiclesExplorer() {
  const params = useSearchParams();
  const urlSearch = params.get("search") || "";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [filters, setFilters] = useState({
    search: urlSearch,
    vehicle_type: "",
    driver_option: "",
    seats: "",
    price: 0,
  });
  const [page, setPage] = useState(1);

  const [vehicles, setVehicles] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // URL badle (home page se search) to filter bhi badal jaye
  useEffect(() => {
    setSearchInput(urlSearch);
    setFilters((f) => ({ ...f, search: urlSearch }));
    setPage(1);
  }, [urlSearch]);

  // Search box: 0.4 sec ruk kar filter lagao
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Vehicles fetch
  useEffect(() => {
    let active = true; // ignore late answers after filters change
    const range = priceRanges[filters.price];

    const q = new URLSearchParams();
    q.set("page", page);
    if (filters.search) q.set("search", filters.search);
    if (filters.vehicle_type) q.set("vehicle_type", filters.vehicle_type);
    if (filters.driver_option) q.set("driver_option", filters.driver_option);
    if (filters.seats) q.set("min_seats", filters.seats);
    if (range.min) q.set("min_price", range.min);
    if (range.max) q.set("max_price", range.max);

    setLoading(true);
    setError("");

    fetch(`${API_URL}/api/vehicles/?${q.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Server error");
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        setVehicles(data.results);
        setCount(data.count);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("Gariyan load nahi ho sakin. Backend server chal raha hai?");
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
    setFilters({ search: "", vehicle_type: "", driver_option: "", seats: "", price: 0 });
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
                placeholder="Car name…"
                className={`${selectClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Vehicle type</label>
            <select
              value={filters.vehicle_type}
              onChange={(e) => setFilter("vehicle_type", e.target.value)}
              className={selectClass}
            >
              <option value="">All types</option>
              <option value="car">Car</option>
              <option value="suv">SUV</option>
              <option value="jeep">Jeep</option>
              <option value="van">Van</option>
              <option value="coaster">Coaster</option>
              <option value="bus">Bus</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Driver</label>
            <select
              value={filters.driver_option}
              onChange={(e) => setFilter("driver_option", e.target.value)}
              className={selectClass}
            >
              <option value="">Any</option>
              <option value="with_driver">With driver</option>
              <option value="self_drive">Self drive</option>
              <option value="both">Driver or self drive</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Seats</label>
            <select
              value={filters.seats}
              onChange={(e) => setFilter("seats", e.target.value)}
              className={selectClass}
            >
              {seatOptions.map((s) => (
                <option key={s.label} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Price per day</label>
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
            {loading ? "Loading…" : `Showing ${from}–${to} of ${count} vehicles`}
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

        {!loading && !error && vehicles.length === 0 && (
          <div className="rounded-2xl bg-gray-50 p-12 text-center text-gray-500">
            Koi gari nahi mili. Filters badal ke dekho.
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
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