"use client";

import { useState } from "react";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function SettingsPage() {
  const { settings, updateSettings, saveSettings } = useStoreSettings();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveSettings();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const inputStyles =
    "w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono";
  const labelStyles = "mb-1 block text-xs font-mono uppercase text-slate-400";

  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Configuración
        </h1>
        <p className="mt-1 text-xs text-slate-400 font-mono">
          Administra la información básica de la tienda, datos de contacto y parámetros globales.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información de la tienda */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide border-b border-slate-800 pb-3">
            Información de la tienda
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelStyles}>Nombre</label>
              <input
                className={inputStyles}
                value={settings.storeName || ""}
                onChange={(e) => updateSettings({ storeName: e.target.value })}
                placeholder="Mundo Store"
              />
            </div>
            <div>
              <label className={labelStyles}>Descripción</label>
              <textarea
                className={`${inputStyles} resize-none`}
                rows={3}
                value={settings.description || ""}
                onChange={(e) => updateSettings({ description: e.target.value })}
                placeholder="Venta de productos destacados y personalizados."
              />
            </div>
            <div>
              <label className={labelStyles}>WhatsApp</label>
              <input
                className={inputStyles}
                value={settings.whatsapp || ""}
                onChange={(e) => updateSettings({ whatsapp: e.target.value })}
                placeholder="+57 300 000 0000"
              />
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide border-b border-slate-800 pb-3">
            Contacto
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelStyles}>Correo</label>
              <input
                className={inputStyles}
                value={settings.email || ""}
                onChange={(e) => updateSettings({ email: e.target.value })}
                placeholder="contacto@tienda.com"
              />
            </div>
            <div>
              <label className={labelStyles}>Dirección</label>
              <input
                className={inputStyles}
                value={settings.address || ""}
                onChange={(e) => updateSettings({ address: e.target.value })}
                placeholder="Calle 123, Ciudad"
              />
            </div>
            <div>
              <label className={labelStyles}>Horario</label>
              <input
                className={inputStyles}
                value={settings.openingHours || ""}
                onChange={(e) => updateSettings({ openingHours: e.target.value })}
                placeholder="Lunes a Viernes 8am - 6pm"
              />
            </div>
          </div>
        </section>

        {/* Opciones de ventas */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide border-b border-slate-800 pb-3">
            Opciones de ventas
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelStyles}>Moneda</label>
              <select
                className={inputStyles}
                value={settings.currency || "USD"}
                onChange={(e) => updateSettings({ currency: e.target.value })}
              >
                <option value="EUR" className="bg-slate-900 text-slate-100">EUR</option>
                <option value="VES" className="bg-slate-900 text-slate-100">VES</option>
                <option value="USD" className="bg-slate-900 text-slate-100">USD</option>
              </select>
            </div>
            <div>
              <label className={labelStyles}>Envío</label>
              <select
                className={inputStyles}
                value={settings.shippingOption || "Gratis por compras mayores"}
                onChange={(e) => updateSettings({ shippingOption: e.target.value })}
              >
                <option value="Gratis por compras mayores" className="bg-slate-900 text-slate-100">
                  Gratis por compras mayores
                </option>
                <option value="Pago por delivery" className="bg-slate-900 text-slate-100">
                  Pago por delivery
                </option>
                <option value="Retiro en tienda" className="bg-slate-900 text-slate-100">
                  Retiro en tienda
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Personalización */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide border-b border-slate-800 pb-3">
            Personalización
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelStyles}>Logo de la tienda</label>
              <input
                className={inputStyles}
                value={settings.logoUrl || ""}
                onChange={(e) => updateSettings({ logoUrl: e.target.value })}
                placeholder="URL de la imagen del logo"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Teléfono 1</label>
                <input
                  className={inputStyles}
                  value={settings.phone1 || ""}
                  onChange={(e) => updateSettings({ phone1: e.target.value })}
                  placeholder="+58 412 000 0000"
                />
              </div>
              <div>
                <label className={labelStyles}>Teléfono 2</label>
                <input
                  className={inputStyles}
                  value={settings.phone2 || ""}
                  onChange={(e) => updateSettings({ phone2: e.target.value })}
                  placeholder="+58 424 000 0000"
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Facebook</label>
              <input
                className={inputStyles}
                value={settings.facebook || ""}
                onChange={(e) => updateSettings({ facebook: e.target.value })}
                placeholder="https://facebook.com/tuempresa"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Instagram</label>
                <input
                  className={inputStyles}
                  value={settings.instagram || ""}
                  onChange={(e) => updateSettings({ instagram: e.target.value })}
                  placeholder="https://instagram.com/tuempresa"
                />
              </div>
              <div>
                <label className={labelStyles}>Instagram 2</label>
                <input
                  className={inputStyles}
                  value={settings.instagram2 || ""}
                  onChange={(e) => updateSettings({ instagram2: e.target.value })}
                  placeholder="https://instagram.com/tuempresa2"
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Banner principal</label>
              <input
                className={inputStyles}
                value={settings.bannerUrl || ""}
                onChange={(e) => updateSettings({ bannerUrl: e.target.value })}
                placeholder="URL de la imagen"
              />
            </div>
            <div>
              <label className={labelStyles}>Color principal</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-10 w-16 cursor-pointer rounded-xl border border-slate-800 bg-slate-950 p-1"
                  value={settings.primaryColor || "#000000"}
                  onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                />
                <span className="font-mono text-xs text-slate-400">
                  {settings.primaryColor || "#000000"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Botón de Guardado Flotante / Inferior */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800/80">
        {saved && (
          <span className="text-xs font-mono text-emerald-400 animate-fade-in flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Cambios guardados correctamente
          </span>
        )}
        <button
          onClick={handleSave}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
