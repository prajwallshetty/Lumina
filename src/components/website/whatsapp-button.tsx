import { MessageCircle } from "lucide-react";

/**
 * Floating WhatsApp CTA. Renders only when a number is configured
 * (env now, Settings CMS later). No third-party asset used — Lucide glyph only.
 */
export function WhatsAppButton({ phone }: { phone?: string | null }) {
  const number = phone ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;

  const href = `https://wa.me/${number.replace(/[^\d]/g, "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
