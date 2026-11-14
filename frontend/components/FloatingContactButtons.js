import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/api";

export default function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I want a tour quote.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg ring-2 ring-white hover:scale-105"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}