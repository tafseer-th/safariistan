"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Hotel,
  Mountain,
  Car,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  BedDouble,
  MessageCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const tabs = [
  { key: "tours", label: "Tours", icon: Compass, href: "/tours", placeholder: "Search destinations or packages" },
  { key: "hotels", label: "Hotels", icon: Hotel, href: "/hotels", placeholder: "Search hotels or locations" },
  { key: "sightseeing", label: "Sightseeing", icon: Mountain, href: "/sightseeing", placeholder: "Search places to visit" },
  { key: "rent-a-car", label: "Rent a car", icon: Car, href: "/rent-a-car", placeholder: "Search cars or routes" },
];

const popular = [
  { label: "Hunza", slug: "hunza" },
  { label: "Skardu", slug: "skardu" },
  { label: "Naran Kaghan", slug: "naran-kaghan" },
  { label: "Swat", slug: "swat-kalam" },
  { label: "Fairy Meadows", slug: "fairy-meadows" },
];

const trust = [
  { icon: ShieldCheck, text: "Private transport" },
  { icon: BedDouble, text: "Handpicked hotels" },
  { icon: MessageCircle, text: "Quick quote on WhatsApp" },
];

export default function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tours");
  const [query, setQuery] = useState("");

  const currentTab = tabs.find((t) => t.key === activeTab);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `${currentTab.href}?search=${encodeURIComponent(q)}` : currentTab.href);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-gray-900">
      {/* Fallback mountains (shown if the video does not load) */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute bottom-0 h-64 w-full"
      >
        <path
          fill="#065f46"
          d="M0,224L120,181L240,235L400,128L560,214L720,96L880,203L1040,139L1200,224L1320,171L1440,208L1440,320L0,320Z"
        />
        <path
          fill="#064e3b"
          d="M0,288L160,240L320,277L520,203L700,267L900,192L1100,261L1260,229L1440,277L1440,320L0,320Z"
        />
      </svg>

      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover saturate-[1.15] contrast-[1.05]"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient: keeps the video colourful while the text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25),transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-16 pt-32 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
          <Sparkles size={14} className="text-green-300" />
          Your Pakistan travel partner
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
          Discover the Beauty of
          <br />
          <span className="text-green-400">Northern Pakistan</span>
        </h1>

        {/* Brand tagline */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="hidden h-px w-14 bg-green-300/70 sm:block" />
          <p className="font-[family-name:var(--font-display)] text-3xl italic text-green-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-4xl">
            Har safar Aik Nai Kahani
          </p>
          <span className="hidden h-px w-14 bg-green-300/70 sm:block" />
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-base text-white/90 sm:text-lg">
          Private tours, handpicked hotels and comfortable rides, all planned
          around you.
        </p>

        {/* Search card */}
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-white p-3 shadow-2xl shadow-black/30">
          {/* Tabs */}
          <div className="grid grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => router.push(tab.href)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-3 text-xs font-semibold transition-all sm:flex-row sm:gap-2 sm:text-sm ${
                    active
                      ? "bg-green-600 text-white shadow"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="mt-3 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 pl-4"
          >
            <Search size={20} className="shrink-0 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={currentTab.placeholder}
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 sm:text-base"
            />
            <Link
              href={currentTab.href}
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 sm:flex"
            >
              <SlidersHorizontal size={16} />
              Filters
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Popular destinations */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-white/80">Popular:</span>
          {popular.map((p) => (
            <Link
              key={p.slug}
              href={`/tours?destination=${p.slug}`}
              className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm transition hover:border-green-500 hover:bg-green-600"
            >
              {p.label}
            </Link>
          ))}
        </div>

        {/* Trust row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-white/90">
          {trust.map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2">
              <Icon size={18} className="text-green-400" />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <ChevronDown
        size={30}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/70"
      />
    </section>
  );
}