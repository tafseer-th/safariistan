"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { submitBooking } from "@/lib/api";
import useToday from "@/lib/useToday";
import BookingSuccess from "@/components/BookingSuccess";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

const emptyForm = {
  name: "",
  phone: "",
  travelDate: "",
  persons: "2",
  departureCity: "",
  message: "",
};

export default function PlaceInquiryForm({ placeName, destination }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const today = useToday();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const data = await submitBooking({
        booking_type: "place",
        item_name: placeName,
        name: form.name,
        phone: form.phone,
        destination: destination || "",
        departure_city: form.departureCity,
        travel_date: form.travelDate || null,
        guests: Number(form.persons) || 1,
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
    return <BookingSuccess {...done} itemName={placeName} onReset={() => setDone(null)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900">Visit {placeName}</h3>
      <p className="mt-1 text-sm text-gray-500">Tour, hotel and transport, all arranged for you.</p>

      <div className="mt-5 space-y-3">
        <input required placeholder="Your name" value={form.name} onChange={update("name")} className={inputClass} />
        <input required placeholder="Phone / WhatsApp" value={form.phone} onChange={update("phone")} className={inputClass} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Travel date</label>
            <input type="date" min={today} value={form.travelDate} onChange={update("travelDate")} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Persons</label>
            <input type="number" min="1" max="100" value={form.persons} onChange={update("persons")} className={inputClass} />
          </div>
        </div>

        <select value={form.departureCity} onChange={update("departureCity")} className={inputClass}>
          <option value="">Departing from (optional)</option>
          <option value="Lahore">Lahore</option>
          <option value="Islamabad">Islamabad</option>
          <option value="Karachi">Karachi</option>
          <option value="Other">Other</option>
        </select>

        <textarea rows={3} placeholder="Message (optional)" value={form.message} onChange={update("message")} className={inputClass} />
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
      >
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {submitting ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
