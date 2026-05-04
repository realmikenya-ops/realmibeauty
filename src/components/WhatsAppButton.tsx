import { MessageCircle } from "lucide-react";

export const WHATSAPP_NUMBER = "254700000000"; // Update to real REALMI KENYA number

export const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi REALMI KENYA, I'd like help with a service.")}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxe transition-transform hover:scale-110"
  >
    <MessageCircle className="h-7 w-7" />
  </a>
);