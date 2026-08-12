"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

export interface StoreSettings {
  id?: string;
  storeName: string;
  description: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  currency: string;
  shippingOption: string;
  primaryColor: string;
  logoUrl: string;
  bannerUrl: string;
  phone1: string;
  phone2: string;
  facebook: string;
  instagram: string;
  instagram2: string;
}

// Configuración vacía por defecto para reflejar exactamente lo de Supabase
const defaultSettings: StoreSettings = {
  storeName: "",
  description: "",
  whatsapp: "",
  email: "",
  address: "",
  openingHours: "",
  currency: "USD",
  shippingOption: "Gratis por compras mayores",
  primaryColor: "#0891b2",
  logoUrl: "",
  bannerUrl: "",
  phone1: "",
  phone2: "",
  facebook: "",
  instagram: "",
  instagram2: "",
};

interface StoreSettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  updateSettings: (value: Partial<StoreSettings>) => void;
  setSettings: (value: StoreSettings) => void;
  saveSettings: () => Promise<void>;
}

const StoreSettingsContext = createContext<
  StoreSettingsContextType | undefined
>(undefined);

export function StoreSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettingsState] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // 1. Cargar la configuración desde Supabase al montar el componente
  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error al cargar la configuración de Supabase:", error);
        } else if (data) {
          // Usamos Nullish Coalescing (??) para respetar cadenas vacías o valores reales de Supabase
          const loadedSettings: StoreSettings = {
            id: data.id,
            storeName: data.store_name ?? "",
            description: data.description ?? "",
            whatsapp: data.whatsapp ?? "",
            email: data.email ?? "",
            address: data.address ?? "",
            openingHours: data.schedule ?? data.opening_hours ?? "",
            currency: data.currency ?? "USD",
            shippingOption:
              data.shipping_option ?? "Gratis por compras mayores",
            primaryColor: data.primary_color ?? "#0891b2",
            logoUrl: data.logo_url ?? "",
            bannerUrl: data.banner_url ?? "",
            phone1: data.phone1 ?? "",
            phone2: data.phone2 ?? "",
            facebook: data.facebook ?? "",
            instagram: data.instagram ?? "",
            instagram2: data.instagram2 ?? "",
          };

          setSettingsState(loadedSettings);

          if (typeof window !== "undefined" && loadedSettings.primaryColor) {
            document.documentElement.style.setProperty(
              "--store-primary",
              loadedSettings.primaryColor
            );
          }
        }
      } catch (error) {
        console.error("Error inesperado al consultar Supabase:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // 2. Modificar el estado local en vivo
  const updateSettings = useCallback((value: Partial<StoreSettings>) => {
    setSettingsState((current) => ({
      ...current,
      ...value,
    }));
  }, []);

  // 3. Guardar cambios en Supabase al hacer clic en "Guardar cambios"
  const saveSettings = useCallback(async () => {
    try {
      const payload: Record<string, unknown> = {
        store_name: settings.storeName,
        description: settings.description,
        whatsapp: settings.whatsapp,
        email: settings.email,
        address: settings.address,
        schedule: settings.openingHours,
        currency: settings.currency,
        shipping_option: settings.shippingOption,
        primary_color: settings.primaryColor,
        logo_url: settings.logoUrl,
        banner_url: settings.bannerUrl,
        phone1: settings.phone1,
        phone2: settings.phone2,
        facebook: settings.facebook,
        instagram: settings.instagram,
        instagram2: settings.instagram2,
        updated_at: new Date().toISOString(),
      };

      if (settings.id) {
        payload.id = settings.id;
      }

      const { data, error } = await supabase
        .from("settings")
        .upsert(payload)
        .select()
        .single();

      if (error) {
        console.error("Error guardando en Supabase:", error);
        alert("Error al guardar en la base de datos: " + error.message);
      } else if (data) {
        setSettingsState((prev) => ({ ...prev, id: data.id }));

        if (typeof window !== "undefined" && settings.primaryColor) {
          document.documentElement.style.setProperty(
            "--store-primary",
            settings.primaryColor
          );
        }
      }
    } catch (error) {
      console.error("Error inesperado al guardar la configuración:", error);
    }
  }, [settings]);

  const contextValue = useMemo(
    () => ({
      settings,
      loading,
      updateSettings,
      setSettings: setSettingsState,
      saveSettings,
    }),
    [settings, loading, updateSettings, saveSettings]
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
    throw new Error(
      "useStoreSettings debe usarse dentro de StoreSettingsProvider"
    );
  }

  return context;
}