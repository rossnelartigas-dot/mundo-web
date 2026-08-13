"use client";

import { MessageCircle } from "lucide-react";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function WhatsAppButton() {
  const { settings } = useStoreSettings();

  const whatsappNumber = settings.whatsapp?.replace(/[^0-9]/g, "") || "";

  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-2xl
        border
        border-emerald-500/40
        bg-slate-900/90
        text-emerald-400
        shadow-[0_0_20px_rgba(16,185,129,0.25)]
        backdrop-blur-md
        transition-all
        duration-300
        hover:scale-110
        hover:border-emerald-400
        hover:bg-emerald-500
        hover:text-slate-950
        hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]
        active:scale-95
      "
    >
      <MessageCircle size={26} className="transition-transform duration-300 hover:rotate-6" />
    </a>
  );
}
