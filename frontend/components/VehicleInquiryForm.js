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
  pickupDate: "",
  days: "1",
  pickupLocation: "",
  destination: "",
  message: "",
};

export default function VehicleInquiryForm({ vehicleName }) {
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
        booking_type: "vehicle",
        item_name: vehicleName,
        name: form.name,
        phone: form.phone,
        departure_city: form.pickupLocation, // pickup location
        destination: form.destination,
        travel_date: form.pickupDate || null,
        days: form.days ? Number(form.days) : null,
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
    return <BookingSuccess {...done} itemName={vehicleName} onReset={() => setDone(null)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900">Rent this vehicle</h3>
      <p className="mt-1 text-sm text-gray-500">Send your details and we will share the rate.</p>

      <div className="mt-5 space-y-3">
        <input required placeholder="Your name" value={form.name} onChange={update("name")} className={inputClass} />
        <input required placeholder="Phone / WhatsApp" value={form.phone} onChange={update("phone")} className={inputClass} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Pickup date</label>
            <input type="date" min={today} value={form.pickupDate} onChange={update("pickupDate")} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Days</label>
            <input type="number" min="1" max="60" value={form.days} onChange={update("days")} className={inputClass} />
          </div>
        </div>

        <input maxLength={60} placeholder="Pickup location (e.g. Islamabad)" value={form.pickupLocation} onChange={update("pickupLocation")} className={inputClass} />
        <input maxLength={120} placeholder="Destination (e.g. Hunza)" value={form.destination} onChange={update("destination")} className={inputClass} />

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
