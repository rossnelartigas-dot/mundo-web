"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface StoreSettings {
  storeName: string;
  description: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  currency: string;
  primaryColor: string;
}

const STORAGE_KEY = "store-settings";

const defaultSettings: StoreSettings = {
  storeName: "Mundo Web",
  description: "Tu tienda de tecnología en Venezuela.",
  whatsapp: "+584264433849",
  email: "contacto@tienda.com",
  address: "Calle 123, Ciudad",
  openingHours: "Lunes a Viernes 8am - 6pm",
  currency: "USD",
  primaryColor: "#0891b2",
};

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (value: Partial<StoreSettings>) => void;
  setSettings: (value: StoreSettings) => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<StoreSettings>(defaultSettings);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved) as Partial<StoreSettings>;
      setSettingsState({ ...defaultSettings, ...parsed });
    } catch (error) {
      console.error("Error cargando configuración:", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.style.setProperty("--store-primary", settings.primaryColor);
  }, [settings]);

  const updateSettings = (value: Partial<StoreSettings>) => {
    setSettingsState((current) => ({ ...current, ...value }));
  };

  const contextValue = useMemo(
    () => ({ settings, updateSettings, setSettings: setSettingsState }),
    [settings]
  );

  return (
    <StoreSettingsContext.Provider value={contextValue}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);

  if (!context) {
    throw new Error("useStoreSettings debe usarse dentro de StoreSettingsProvider");
  }

  return context;
}
