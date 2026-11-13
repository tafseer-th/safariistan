"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { API_URL, WHATSAPP_NUMBER, submitBooking } from "@/lib/api";
import useToday from "@/lib/useToday";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  destination: "",
  departure_city: "",
  travel_date: "",
  days: "",
  guests: "2",
  budget: "",
  message: "",
};

export default function MakeMyTripForm() {
  const [form, setForm] = useState(emptyForm);
  const [destinations, setDestinations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // { id, name }

  useEffect(() => {
    fetch(`${API_URL}/api/destinations/`)
      .then((r) => r.json())
      .then(setDestinations)
      .catch(() => {});
  }, []);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const today = useToday();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await submitBooking({
        booking_type: "trip",
        name: form.name,
        phone: form.phone,
        email: form.email,
        destination: form.destination,
        departure_city: form.departure_city,
        travel_date: form.travel_date || null,
        days: form.days ? Number(form.days) : null,
        guests: Number(form.guests) || 1,
        budget: form.budget ? Number(form.budget) : null,
        message: form.message,
      });
      setDone({ id: data.id, name: form.name });
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    const text = encodeURIComponent(
      `Hi, I just sent a trip request on your website (reference #${done.id}). My name is ${done.name}.`
    );
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle2 size={56} className="mx-auto text-green-600" />
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
          Thank you, {done.name}!
        </h2>
        <p className="mt-2 text-gray-600">
          Your trip request <strong>#{done.id}</strong> has been received. Our team
          will contact you shortly with a plan and quote.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
          <button
            onClick={() => setDone(null)}
            className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-white"
          >
            Send another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Your name *</label>
          <input required value={form.name} onChange={update("name")} placeholder="Full name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone / WhatsApp *</label>
          <input required value={form.phone} onChange={update("phone")} placeholder="03XX XXXXXXX" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Email (optional)</label>
          <input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Where do you want to go?</label>
          <select value={form.destination} onChange={update("destination")} className={inputClass}>
            <option value="">Not sure yet</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Departing from</label>
          <select value={form.departure_city} onChange={update("departure_city")} className={inputClass}>
            <option value="">Select city</option>
            <option value="Lahore">Lahore</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Karachi">Karachi</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Travel date</label>
          <input type="date" min={today} value={form.travel_date} onChange={update("travel_date")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Number of days</label>
          <input type="number" min="1" max="30" value={form.days} onChange={update("days")} placeholder="e.g. 5" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Number of travelers</label>
          <input type="number" min="1" max="100" value={form.guests} onChange={update("guests")} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Budget per person in Rs (optional)</label>
          <input type="number" min="0" value={form.budget} onChange={update("budget")} placeholder="e.g. 40000" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Anything else we should know?</label>
          <textarea
            rows={4}
            value={form.message}
            onChange={update("message")}
            placeholder="Honeymoon, family trip, hotel preferences, places you want to see…"
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
      >
        {submitting && <Loader2 size={18} className="animate-spin" />}
        {submitting ? "Sending…" : "Plan my trip"}
      </button>
    </form>
  );
}