import credits from "@/lib/photo-credits.json";

export const metadata = {
  title: "Photo Credits | Safaristan",
  description: "Credits and licences for the photographs used on Safaristan.",
};

export default function PhotoCreditsPage() {
  return (
    <main className="bg-white pt-20">
      <section className="border-b border-gray-100 bg-green-50/60">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Photo <span className="text-green-600">Credits</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Many photographs on this site are shared by their photographers on Wikimedia Commons under
            open licences. Thank you to everyone listed below.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ul className="divide-y divide-gray-100">
          {credits.map((c) => (
            <li key={c.file} className="py-3 text-sm text-gray-700">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-green-700 hover:underline"
              >
                {c.title}
              </a>{" "}
              by {c.author} &middot; {c.license}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
