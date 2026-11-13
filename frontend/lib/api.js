export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

// Contact numbers come from frontend/.env.local (restart `npm run dev` after changing it).
// WhatsApp: country code + number, no "+" and no spaces, e.g. 923001234567
export const WHATSAPP_NUMBER =
  (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923000000000").replace(/\D/g, "");

// Phone for the Call button, e.g. +923001234567
export const PHONE_NUMBER =
  process.env.NEXT_PUBLIC_PHONE_NUMBER || `+${WHATSAPP_NUMBER}`;

export function formatPrice(n) {
  return `Rs ${Number(n).toLocaleString("en-PK")}`;
}

// Saves a booking / inquiry in the backend (it then shows up in the admin panel).
export async function submitBooking(payload) {
  const res = await fetch(`${API_URL}/api/bookings/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const first = Object.values(data)[0];
    const message = Array.isArray(first)
      ? first[0]
      : data.detail || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}