"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X, Mountain } from "lucide-react";

const tourPackageLinks = [
  { label: "Skardu Tour Packages", href: "/tours?destination=skardu" },
  { label: "Hunza Valley Tours Packages", href: "/tours?destination=hunza" },
  { label: "Naran Kaghan Tours Packages", href: "/tours?destination=naran-kaghan" },
  { label: "Azad Kashmir Tour Packages", href: "/tours?destination=azad-kashmir" },
  { label: "Hunza Skardu Tours Packages", href: "/tours?destination=hunza-skardu" },
  { label: "Fairy Meadows Tour Packages", href: "/tours?destination=fairy-meadows" },
  { label: "Swat Kalam Tour Packages", href: "/tours?destination=swat-kalam" },
  { label: "Neelum Valley Tour Packages", href: "/tours?destination=neelum-valley" },
  { label: "Kumrat Valley Tour Packages", href: "/tours?destination=kumrat-valley" },
  { label: "Chitral Kalash Tour Dates", href: "/tours?destination=chitral-kalash" },
  { label: "Ratti Gali Lake Tour Packages", href: "/tours?destination=ratti-gali" },
];

const honeymoonLinks = [
  { label: "Nathia Gali Tour Packages", href: "/tours?destination=nathia-gali" },
  { label: "Hunza Honeymoon Packages", href: "/tours?category=honeymoon&destination=hunza" },
  { label: "Skardu Honeymoon Packages", href: "/tours?category=honeymoon&destination=skardu" },
  { label: "Pakistan Honeymoon Packages", href: "/tours?category=honeymoon" },
  { label: "Honeymoon Packages from Karachi", href: "/tours?category=honeymoon&from=karachi" },
  { label: "Malam Jabba Tour Packages", href: "/tours?destination=malam-jabba" },
  { label: "Gilgit Tour Packages", href: "/tours?destination=gilgit" },
  { label: "Murree Tour Packages", href: "/tours?destination=murree" },
  { label: "Family Tour Packages", href: "/tours?category=family" },
  { label: "Shogran Valley Tour Packages", href: "/tours?destination=shogran" },
  { label: "Tour Packages from Lahore", href: "/tours?from=lahore" },
  { label: "Tour Packages from Islamabad", href: "/tours?from=islamabad" },
];

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Hotels", href: "/hotels" },
  { label: "Rent a Car", href: "/rent-a-car" },
  { label: "Sightseeing", href: "/sightseeing" },
];

function DropdownMenu({ title, links }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 text-sm font-medium text-gray-800 transition-colors hover:text-green-600">
        {title}
        <ChevronDown size={15} className="transition-transform group-hover:rotate-180" />
      </button>

      <div className="invisible absolute left-0 top-full z-50 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="max-h-[70vh] w-72 overflow-y-auto rounded-2xl border border-gray-100 bg-white py-2 shadow-xl">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-green-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
            <Mountain size={22} />
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-gray-900">
            Safaristan
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-7 lg:flex">
          {mainLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-800 transition-colors hover:text-green-600"
            >
              {l.label}
            </Link>
          ))}
          <DropdownMenu title="Tour Packages" links={tourPackageLinks} />
          <DropdownMenu title="Honeymoon Tours" links={honeymoonLinks} />
          <Link href="/destinations" className="text-sm font-medium text-gray-800 transition-colors hover:text-green-600">
            Destinations
          </Link>
          <Link
            href="/make-my-trip"
            className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Make My Trip
          </Link>
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-800 lg:hidden"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t bg-white px-4 pb-6 lg:hidden">
          {mainLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} className="block py-3 text-gray-800">
              {l.label}
            </Link>
          ))}

          <p className="pt-3 text-xs font-semibold uppercase text-gray-400">Tour Packages</p>
          {tourPackageLinks.map((l) => (
            <Link key={l.label} href={l.href} onClick={close} className="block py-2 text-sm text-gray-600">
              {l.label}
            </Link>
          ))}

          <p className="pt-3 text-xs font-semibold uppercase text-gray-400">Honeymoon Tours</p>
          {honeymoonLinks.map((l) => (
            <Link key={l.label} href={l.href} onClick={close} className="block py-2 text-sm text-gray-600">
              {l.label}
            </Link>
          ))}

          <Link href="/destinations" onClick={close} className="block py-3 text-gray-800">
            Destinations
          </Link>
          <Link
            href="/make-my-trip"
            onClick={close}
            className="mt-2 block rounded-full bg-green-600 py-3 text-center font-semibold text-white"
          >
            Make My Trip
          </Link>
        </div>
      )}
    </header>
  );
}