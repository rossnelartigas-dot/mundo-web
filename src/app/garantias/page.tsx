import Link from "next/link";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  MessageCircle,
  HelpCircle
} from "lucide-react";

import { supabase } from "@/lib/supabase"; // Ajusta el path a tu cliente de Supabase

export const revalidate = 60;

async function getSettingsFromSupabase() {
  try {
    const { data } = await supabase.from("settings").select("*").single();
    return data;
  } catch {
    return null;
  }
}

export default async function GarantiasPage() {
  const settings = await getSettingsFromSupabase();
  const rawPhone = settings?.whatsapp_phone || settings?.phone || settings?.whatsapp || "";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const storeName = settings?.store_name || "Mundo Web";

  const whatsappMessage = encodeURIComponent(
    `Hola, necesito información o soporte sobre la garantía de un producto adquirido en ${storeName}.`
  );

  const whatsappUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${whatsappMessage}`
    : "#";

  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-10">

        {/* NAVEGACIÓN Y REGRESO */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-mono font-semibold py-2 px-4 text-xs sm:text-sm transition border border-slate-800 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            Volver al Inicio
          </Link>
        </div>

        {/* ENCABEZADO PRINCIPAL */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
            Políticas de Respaldo
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Políticas de <span className="text-cyan-400">Garantía y Soporte</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-xs sm:text-sm font-mono leading-relaxed">
            En {storeName} nos aseguramos de que todos nuestros productos y equipos cuenten con el respaldo técnico y la garantía necesaria para tu tranquilidad.
          </p>
        </section>

        {/* PASOS PARA SOLICITAR GARANTÍA */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            ¿Cómo solicitar tu Garantía?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs sm:text-sm">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <span className="text-cyan-400 font-bold text-base">01.</span>
              <h3 className="font-bold text-white">Factura o Comprobante</h3>
              <p className="text-slate-400">Ten a la mano tu número de orden o nota de entrega emitida al momento de la compra.</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <span className="text-cyan-400 font-bold text-base">02.</span>
              <h3 className="font-bold text-white">Empaque Original</h3>
              <p className="text-slate-400">Conserva la caja original, manuales, cables y accesorios completos del producto.</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <span className="text-cyan-400 font-bold text-base">03.</span>
              <h3 className="font-bold text-white">Contacto Directo</h3>
              <p className="text-slate-400">Escríbenos por WhatsApp reportando la falla reportada con fotos o videos de evidencia.</p>
            </div>
          </div>
        </section>

        {/* COBERTURA VS EXCLUSIONES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LO QUE SÍ CUBRE */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <CheckCircle2 className="w-6 h-6" />
              <span>¿Qué cubre la garantía?</span>
            </div>
            <ul className="space-y-3 font-mono text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span> Defectos de fábrica en componentes internos.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span> Fallas de hardware en funcionamiento normal.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span> Soporte técnico de revisión diagnóstica inicial sin costo.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span> Reemplazo de equipo o pieza dañada si aplica el cambio directo.
              </li>
            </ul>
          </div>

          {/* LO QUE NO CUBRE */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
              <XCircle className="w-6 h-6" />
              <span>Anulación de garantía</span>
            </div>
            <ul className="space-y-3 font-mono text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span> Daños físicos (golpes, humedad, sulfatación, rajaduras).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span> Sobretensiones eléctricas o picos de voltaje.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span> Sellos de garantía rotos o manipulación no autorizada.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">•</span> Problemas causados por software/virus instalados por el usuario.
              </li>
            </ul>
          </div>
        </section>

        {/* TIEMPOS DE RESPUESTA */}
        <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Tiempo de evaluación técnica</p>
              <p className="text-slate-400">El diagnóstico y respuesta sobre la garantía toma entre 24 y 72 horas hábiles.</p>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE CONTACTO */}
        <section className="text-center p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <HelpCircle className="w-10 h-10 text-cyan-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">¿Tienes dudas sobre la garantía de tu equipo?</h2>
          <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-lg mx-auto">
            Nuestro equipo de soporte técnico está disponible para atender tu caso personalmente.
          </p>

          {cleanPhone && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold py-3 px-6 text-sm transition border border-emerald-400/30 shadow-lg shadow-emerald-950/50"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Contactar Soporte por WhatsApp
            </a>
          )}
        </section>

      </div>
    </main>
  );
}