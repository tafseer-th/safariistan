import { WHATSAPP_NUMBER, PHONE_NUMBER } from "@/lib/api";

// All public contact details in one place. Values come from frontend/.env.local;
// anything left empty is simply hidden on the site.
export const SITE = {
  name: "Safaristan",
  tagline: "Har safar aik nai kahani",
  whatsapp: WHATSAPP_NUMBER,
  phone: PHONE_NUMBER,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "",
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
  },
};

// "+923150572710" -> "+92 315 0572710"
export function prettyPhone(p) {
  const d = p.replace(/\D/g, "");
  return d.startsWith("92") && d.length === 12
    ? `+92 ${d.slice(2, 5)} ${d.slice(5)}`
    : p;
}
