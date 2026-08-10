"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function ContactoPage() {
  const { settings } = useStoreSettings();

  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/" className="mb-4 inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700">
          ← Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Contacto</h1>
        <p className="mt-3 text-slate-600">
          Estamos listos para ayudarte con tus compras, dudas o pedidos personalizados.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-800">WhatsApp</h2>
            <p className="mt-2 text-slate-600">Escríbenos para asesoría rápida.</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <MessageCircle size={16} />
              Chatear por WhatsApp
            </a>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-800">Teléfonos</h2>
            <div className="mt-3 space-y-2 text-slate-600">
              {settings.phone1 ? (
                <a href={`tel:${settings.phone1}`} className="flex items-center gap-2 hover:text-cyan-600">
                  <Phone size={16} />
                  {settings.phone1}
                </a>
              ) : null}
              {settings.phone2 ? (
                <a href={`tel:${settings.phone2}`} className="flex items-center gap-2 hover:text-cyan-600">
                  <Phone size={16} />
                  {settings.phone2}
                </a>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-800">Redes sociales</h2>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
              {settings.facebook ? (
                <a href={settings.facebook} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 px-3 py-2 hover:border-cyan-500 hover:text-cyan-600">
                  Facebook
                </a>
              ) : null}
              {settings.instagram ? (
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 px-3 py-2 hover:border-cyan-500 hover:text-cyan-600">
                  Instagram
                </a>
              ) : null}
              {settings.instagram2 ? (
                <a href={settings.instagram2} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 px-3 py-2 hover:border-cyan-500 hover:text-cyan-600">
                  Instagram 2
                </a>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-800">Horario</h2>
            <p className="mt-2 text-slate-600">{settings.openingHours}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
