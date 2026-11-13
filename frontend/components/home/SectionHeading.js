import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Shared heading for home page sections: small label, title, text, "view all" link.
export default function SectionHeading({ eyebrow, title, highlight, text, href, linkLabel = "View all" }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">{eyebrow}</p>
        )}
        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {title}{" "}
          {highlight && (
            <span className="font-[family-name:var(--font-display)] italic text-green-600">{highlight}</span>
          )}
        </h2>
        {text && <p className="mt-3 text-gray-600">{text}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-green-600 hover:text-green-700"
        >
          {linkLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
