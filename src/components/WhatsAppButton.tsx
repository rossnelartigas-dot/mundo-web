"use client";

import { MessageCircle } from "lucide-react";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function WhatsAppButton() {
  const { settings } = useStoreSettings();

  return (
    <a
      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition"
    >
      <MessageCircle size={30} />
    </a>
  );
}