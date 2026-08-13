"use client";

import Link from "next/link";
import { MessageCircle, Phone, Clock, Share2 } from "lucide-react";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function ContactoPage() {
  const { settings } = useStoreSettings();

  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* BREADCRUMB / VOLVER */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono transition-all backdrop-blur-md w-fit"
          >
            ← Volver al inicio
          </Link>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-8">
          
          {/* ENCABEZADO */}
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Atención al Cliente
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Contacto
            </h1>
            <p className="mt-2 text-xs font-mono text-slate-400">
              Estamos listos para ayudarte con tus compras, dudas o pedidos personalizados.
            </p>
          </div>

          {/* TARJETAS DE INFORMACIÓN */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* WHATSAPP */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-md flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <MessageCircle size={20} />
                  </div>
                  <h2 className="text-base font-bold text-white">WhatsApp</h2>
                </div>
                <p className="mt-3 text-xs font-mono text-slate-400">
                  Escríbenos directamente para asesoría en tiempo real y soporte de pedidos.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 px-5 py-3 text-xs font-mono font-bold text-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] w-full sm:w-fit"
              >
                <MessageCircle size={16} />
                <span>Chatear por WhatsApp</span>
              </a>
            </div>

            {/* TELÉFONOS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Phone size={20} />
                </div>
                <h2 className="text-base font-bold text-white">Teléfonos</h2>
              </div>

              <div className="space-y-3 pt-1">
                {settings.phone1 ? (
                  <a
                    href={`tel:${settings.phone1}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-2.5 text-xs font-mono text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                  >
                    <Phone size={14} className="text-cyan-400" />
                    <span>{settings.phone1}</span>
                  </a>
                ) : null}

                {settings.phone2 ? (
                  <a
                    href={`tel:${settings.phone2}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-2.5 text-xs font-mono text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                  >
                    <Phone size={14} className="text-cyan-400" />
                    <span>{settings.phone2}</span>
                  </a>
                ) : null}
              </div>
            </div>

            {/* REDES SOCIALES */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-md space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Share2 size={20} />
                </div>
                <h2 className="text-base font-bold text-white">Redes sociales</h2>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                {settings.facebook ? (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-mono text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-slate-900 transition-all"
                  >
                    Facebook
                  </a>
                ) : null}
                {settings.instagram ? (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-mono text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-slate-900 transition-all"
                  >
                    Instagram
                  </a>
                ) : null}
                {settings.instagram2 ? (
                  <a
                    href={settings.instagram2}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-mono text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-slate-900 transition-all"
                  >
                    Instagram 2
                  </a>
                ) : null}
              </div>
            </div>

            {/* HORARIO DE ATENCIÓN */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-md space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Clock size={20} />
                </div>
                <h2 className="text-base font-bold text-white">Horario de Atención</h2>
              </div>
              <p className="text-xs font-mono text-slate-300 pt-1">
                {settings.openingHours || "Atención disponible durante todo el día."}
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
