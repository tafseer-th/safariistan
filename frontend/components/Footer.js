import Link from "next/link";
import { Mountain, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SITE, prettyPhone } from "@/lib/site";

const explore = [
  { label: "Tour Packages", href: "/tours" },
  { label: "Hotels", href: "/hotels" },
  { label: "Rent a Car", href: "/rent-a-car" },
  { label: "Sightseeing", href: "/sightseeing" },
  { label: "Destinations", href: "/destinations" },
  { label: "Make My Trip", href: "/make-my-trip" },
];

const popular = [
  { label: "Hunza Valley Tours", href: "/tours?destination=hunza" },
  { label: "Skardu Tours", href: "/tours?destination=skardu" },
  { label: "Naran Kaghan Tours", href: "/tours?destination=naran-kaghan" },
  { label: "Swat Kalam Tours", href: "/tours?destination=swat-kalam" },
  { label: "Honeymoon Packages", href: "/tours?category=honeymoon" },
  { label: "Family Tours", href: "/tours?category=family" },
];

// Small brand icons (lucide no longer ships brand logos)
const icons = {
  facebook: (
    <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" />
    </>
  ),
  youtube: (
    <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8zM10 15.1V8.9l5.2 3.1z" />
  ),
  tiktok: (
    <path d="M16.5 3c.4 2.3 1.8 3.8 4 4v3.2c-1.5 0-2.9-.4-4-1.2v6.2A6.2 6.2 0 1 1 10.3 9v3.3a3 3 0 1 0 2.9 3V3z" />
  ),
};

function SocialLink({ name, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-green-600"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        {icons[name]}
      </svg>
    </a>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-gray-400 transition hover:text-green-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const socials = Object.entries(SITE.social).filter(([, url]) => url);

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
              <Mountain size={22} />
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-white">{SITE.name}</span>
          </Link>
          <p className="mt-3 font-[family-name:var(--font-display)] text-lg italic text-green-400">
            {SITE.tagline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Private and family tours across northern Pakistan, with hotels, transport and
            sightseeing arranged for you.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(([name, url]) => (
                <SocialLink key={name} name={name} href={url} />
              ))}
            </div>
          )}
        </div>

        <FooterLinks title="Explore" links={explore} />
        <FooterLinks title="Popular tours" links={popular} />

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact us</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={`tel:${SITE.phone}`} className="flex items-start gap-3 text-gray-400 hover:text-green-400">
                <Phone size={17} className="mt-0.5 shrink-0 text-green-500" />
                {prettyPhone(SITE.phone)}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-gray-400 hover:text-green-400"
              >
                <MessageCircle size={17} className="mt-0.5 shrink-0 text-green-500" />
                Chat on WhatsApp
              </a>
            </li>
            {SITE.email && (
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-start gap-3 break-all text-gray-400 hover:text-green-400">
                  <Mail size={17} className="mt-0.5 shrink-0 text-green-500" />
                  {SITE.email}
                </a>
              </li>
            )}
            {SITE.address && (
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={17} className="mt-0.5 shrink-0 text-green-500" />
                {SITE.address}
              </li>
            )}
          </ul>

          <Link
            href="/make-my-trip"
            className="mt-6 inline-block rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            Plan my trip
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-gray-500 sm:flex-row sm:px-6">
          <p>© {SITE.name}. All rights reserved.</p>
          <p>Made in Pakistan 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}
