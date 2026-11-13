import MakeMyTripForm from "@/components/MakeMyTripForm";

export const metadata = {
  title: "Make My Trip | Safaristan",
  description:
    "Tell us where you want to go and we will plan a private tour with hotels, transport and sightseeing.",
};

const steps = [
  { title: "Tell us your plan", text: "Share your destination, dates and budget." },
  { title: "We build your trip", text: "Hotels, transport and sightseeing, all arranged for you." },
  { title: "Get your quote", text: "We contact you on WhatsApp or phone with the final plan." },
];

export default function MakeMyTripPage() {
  return (
    <main className="bg-white pt-20">
      <section className="border-b border-gray-100 bg-green-50/60">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Make <span className="text-green-600">My Trip</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Tell us what you have in mind and we will design a private tour around it.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MakeMyTripForm />
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">How it works</h2>
            <ol className="mt-5 space-y-5">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{s.title}</p>
                    <p className="text-sm text-gray-500">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>
    </main>
  );
}