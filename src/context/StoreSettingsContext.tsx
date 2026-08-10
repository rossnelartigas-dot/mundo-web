"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
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
  logoUrl: string;
  phone1: string;
  phone2: string;
  facebook: string;
  instagram: string;
  instagram2: string;
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
  logoUrl: "",
  phone1: "+58 412 000 0000",
  phone2: "+58 424 000 0000",
  facebook: "",
  instagram: "",
  instagram2: "",
};

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (value: Partial<StoreSettings>) => void;
  setSettings: (value: StoreSettings) => void;
  saveSettings: () => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<StoreSettings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as Partial<StoreSettings>;
        setSettingsState({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error("Error cargando configuración:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const persistSettings = useCallback((value: StoreSettings) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      document.documentElement.style.setProperty("--store-primary", value.primaryColor);
      window.dispatchEvent(new CustomEvent("store-settings-updated", { detail: value }));
    } catch (error) {
      console.error("Error guardando configuración:", error);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    persistSettings(settings);
  }, [settings, isHydrated, persistSettings]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) {
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue) as Partial<StoreSettings>;
        setSettingsState({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Error actualizando configuración desde storage:", error);
      }
    };

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<StoreSettings>;
      setSettingsState(customEvent.detail);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("store-settings-updated", handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("store-settings-updated", handleCustomEvent as EventListener);
    };
  }, []);

  const updateSettings = (value: Partial<StoreSettings>) => {
    setSettingsState((current) => ({ ...current, ...value }));
  };

  const saveSettings = () => {
    persistSettings(settings);
  };

  const contextValue = useMemo(
    () => ({ settings, updateSettings, setSettings: setSettingsState, saveSettings }),
    [settings, persistSettings]
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
