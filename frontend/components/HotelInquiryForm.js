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
  checkIn: "",
  checkOut: "",
  guests: "2",
  message: "",
};

function nightsBetween(a, b) {
  if (!a || !b) return null;
  const n = Math.round((new Date(b) - new Date(a)) / 86400000);
  return n > 0 ? n : null;
}

export default function HotelInquiryForm({ hotelName, location }) {
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
        booking_type: "hotel",
        item_name: hotelName,
        name: form.name,
        phone: form.phone,
        destination: location || "",
        travel_date: form.checkIn || null,
        end_date: form.checkOut || null,
        days: nightsBetween(form.checkIn, form.checkOut),
        guests: Number(form.guests) || 1,
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
    return <BookingSuccess {...done} itemName={hotelName} onReset={() => setDone(null)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900">Book / Inquiry</h3>
      <p className="mt-1 text-sm text-gray-500">Send your details and we will share a quote.</p>

      <div className="mt-5 space-y-3">
        <input required placeholder="Your name" value={form.name} onChange={update("name")} className={inputClass} />
        <input required placeholder="Phone / WhatsApp" value={form.phone} onChange={update("phone")} className={inputClass} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Check-in</label>
            <input type="date" min={today} value={form.checkIn} onChange={update("checkIn")} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Check-out</label>
            <input type="date" min={form.checkIn || today} value={form.checkOut} onChange={update("checkOut")} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Guests</label>
          <input type="number" min="1" max="100" value={form.guests} onChange={update("guests")} className={inputClass} />
        </div>

        <textarea rows={3} placeholder="Message (optional)" value={form.message} onChange={update("message")} className={inputClass} />
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
      >
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {submitting ? "Sending…" : "Send booking request"}
      </button>
    </form>
  );
}
