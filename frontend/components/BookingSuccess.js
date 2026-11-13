"use client";

import { CheckCircle2, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/api";

// Shown after a booking is saved. Gives the customer a reference number
// and an optional WhatsApp shortcut that already mentions that number.
export default function BookingSuccess({ id, name, itemName, onReset }) {
  const text = encodeURIComponent(
    `Hi, I just sent a booking request on your website for ${itemName} (reference #${id}). My name is ${name}.`
  );

  return (
    <div className="rounded-3xl border border-green-200 bg-green-50 p-6 text-center shadow-lg">
      <CheckCircle2 size={48} className="mx-auto text-green-600" />
      <h3 className="mt-3 text-xl font-extrabold text-gray-900">Thank you, {name}!</h3>
      <p className="mt-2 text-sm text-gray-600">
        Your request <strong>#{id}</strong> for <strong>{itemName}</strong> has been received.
        Our team will contact you shortly.
      </p>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
      >
        <MessageCircle size={18} />
        Chat on WhatsApp
      </a>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-white"
      >
        Send another request
      </button>
    </div>
  );
}
