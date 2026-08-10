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

    const color = settings.primaryColor || "#0891b2";
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <rect width="64" height="64" rx="16" fill="white" />
        <circle cx="32" cy="32" r="24" fill="${color}" />
        <path d="M22 24h20l-6 16h-8z" fill="white" />
        <rect x="24" y="42" width="16" height="4" rx="2" fill="white" />
      </svg>
    `;

    favicon.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [settings.primaryColor, settings.storeName]);

  return null;
}
