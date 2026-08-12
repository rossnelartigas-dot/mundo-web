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

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
        <p className="mt-2 text-slate-500">
          Administra la información básica de la tienda y las opciones principales.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información de la tienda */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Información de la tienda</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.storeName || ""}
                onChange={(e) => updateSettings({ storeName: e.target.value })}
                placeholder="Mundo Store"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Descripción</label>
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                rows={3}
                value={settings.description || ""}
                onChange={(e) => updateSettings({ description: e.target.value })}
                placeholder="Venta de productos destacados y personalizados."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">WhatsApp</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.whatsapp || ""}
                onChange={(e) => updateSettings({ whatsapp: e.target.value })}
                placeholder="+57 300 000 0000"
              />
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Contacto</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.email || ""}
                onChange={(e) => updateSettings({ email: e.target.value })}
                placeholder="contacto@tienda.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Dirección</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.address || ""}
                onChange={(e) => updateSettings({ address: e.target.value })}
                placeholder="Calle 123, Ciudad"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Horario</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.openingHours || ""}
                onChange={(e) => updateSettings({ openingHours: e.target.value })}
                placeholder="Lunes a Viernes 8am - 6pm"
              />
            </div>
          </div>
        </section>

        {/* Opciones de ventas */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Opciones de ventas</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Moneda</label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.currency || "USD"}
                onChange={(e) => updateSettings({ currency: e.target.value })}
              >
                <option value="EUR">EUR</option>
                <option value="VES">VES</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Envío</label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.shippingOption || "Gratis por compras mayores"}
                onChange={(e) => updateSettings({ shippingOption: e.target.value })}
              >
                <option value="Gratis por compras mayores">Gratis por compras mayores</option>
                <option value="Pago por delivery">Pago por delivery</option>
                <option value="Retiro en tienda">Retiro en tienda</option>
              </select>
            </div>
          </div>
        </section>

        {/* Personalización */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Personalización</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Logo de la tienda</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.logoUrl || ""}
                onChange={(e) => updateSettings({ logoUrl: e.target.value })}
                placeholder="URL de la imagen del logo"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono 1</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.phone1 || ""}
                onChange={(e) => updateSettings({ phone1: e.target.value })}
                placeholder="+58 412 000 0000"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono 2</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.phone2 || ""}
                onChange={(e) => updateSettings({ phone2: e.target.value })}
                placeholder="+58 424 000 0000"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Facebook</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.facebook || ""}
                onChange={(e) => updateSettings({ facebook: e.target.value })}
                placeholder="https://facebook.com/tuempresa"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Instagram</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.instagram || ""}
                onChange={(e) => updateSettings({ instagram: e.target.value })}
                placeholder="https://instagram.com/tuempresa"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Instagram 2</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.instagram2 || ""}
                onChange={(e) => updateSettings({ instagram2: e.target.value })}
                placeholder="https://instagram.com/tuempresa2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Banner principal</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={settings.bannerUrl || ""}
                onChange={(e) => updateSettings({ bannerUrl: e.target.value })}
                placeholder="URL de la imagen"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Color principal</label>
              <input
                type="color"
                className="h-10 w-16 cursor-pointer rounded border border-slate-300"
                value={settings.primaryColor || "#000000"}
                onChange={(e) => updateSettings({ primaryColor: e.target.value })}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm font-medium text-green-600">
            Cambios guardados correctamente
          </span>
        )}
        <button
          onClick={handleSave}
          className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-700 transition-colors"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}