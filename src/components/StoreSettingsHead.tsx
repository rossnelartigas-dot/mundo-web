"use client";

import { useEffect } from "react";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function StoreSettingsHead() {
  const { settings } = useStoreSettings();

  useEffect(() => {
    const title = settings.storeName || "Mundo Web";
    document.title = title;

    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    const primaryColor = settings.primaryColor || "#06b6d4"; // Acento neón (Cyan por defecto)

    // SVG estilizado con temática Cyberpunk / Dark Mode (Fondo oscuro Slate-950 con acentos dinámicos)
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <rect width="64" height="64" rx="16" fill="#020617" />
        <rect x="2" y="2" width="60" height="60" rx="14" fill="none" stroke="${primaryColor}" stroke-width="2" stroke-opacity="0.5" />
        <circle cx="32" cy="32" r="20" fill="${primaryColor}" fill-opacity="0.15" stroke="${primaryColor}" stroke-width="2" />
        <path d="M22 24h20l-6 16h-8z" fill="${primaryColor}" />
        <rect x="24" y="42" width="16" height="4" rx="2" fill="#f8fafc" />
      </svg>
    `;

    favicon.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [settings.primaryColor, settings.storeName]);

  return null;
}
