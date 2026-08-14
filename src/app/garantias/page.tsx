import Link from "next/link";
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  MessageCircle,
  HelpCircle,
  Receipt,
  Package,
  Headphones
} from "lucide-react";

import { supabase } from "@/lib/supabase"; // Ajusta la ruta a tu cliente de Supabase

export const revalidate = 60;

interface Settings {
  whatsapp_phone?: string;
  phone?: string;
  whatsapp?: string;
  store_name?: string;
}

async function getSettingsFromSupabase(): Promise<Settings | null> {
  try {
    const { data, error } = await supabase.from("settings").select("*").single();
    if (error) {
      console.error("Error fetching settings from Supabase:", error.message);
      return null;
    }
    return data as Settings;
  } catch (err) {
    console.error("Unexpected error fetching settings:", err);
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

  const pasosSolicitud = [
    {
      num: "01",
      icon: Receipt,
      title: "Factura o Comprobante",
      desc: "Ten a la mano tu número de orden o nota de entrega emitida al momento de la compra."
    },
    {
      num: "02",
      icon: Package,
      title: "Empaque Original",
      desc: "Conserva la caja original, manuales, cables y accesorios completos del producto."
    },
    {
      num: "03",
      icon: Headphones,
      title: "Contacto Directo",
      desc: "Escríbenos por WhatsApp reportando la falla observada con fotos o videos de evidencia."
    }
  ];

  const coberturas = [
    "Defectos de fábrica en componentes internos.",
    "Fallas de hardware durante el funcionamiento normal.",
    "Soporte técnico y revisión diagnóstica inicial sin costo.",
    "Reemplazo de equipo o pieza si aplica el cambio directo por garantía."
  ];

  const exclusiones = [
    "Daños físicos (golpes, humedad, sulfatación, rajaduras o quiebres).",
    "Sobretensiones eléctricas, descargas o picos de voltaje.",
    "Sellos de garantía rotos, alterados o manipulación no autorizada.",
    "Fallas causadas por software, virus o firmware modificado por el usuario."
  ];

  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-10">

        {/* NAVEGACIÓN Y REGRESO */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-mono font-semibold py-2 px-4 text-xs sm:text-sm transition border border-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            En <span className="text-slate-200 font-semibold">{storeName}</span> nos aseguramos de que todos nuestros productos y equipos cuenten con el respaldo técnico y la garantía necesaria para tu tranquilidad.
          </p>
        </section>

        {/* PASOS PARA SOLICITAR GARANTÍA */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            ¿Cómo solicitar tu Garantía?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs sm:text-sm">
            {pasosSolicitud.map((paso) => (
              <div 
                key={paso.num} 
                className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 space-y-2 hover:border-slate-700/80 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold text-base">{paso.num}.</span>
                  <paso.icon className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="font-bold text-white text-sm">{paso.title}</h3>
                <p className="text-slate-400 leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COBERTURA VS EXCLUSIONES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LO QUE SÍ CUBRE */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <span>¿Qué cubre la garantía?</span>
            </div>
            <ul className="space-y-3 font-mono text-xs sm:text-sm text-slate-300">
              {coberturas.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* LO QUE NO CUBRE */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
              <XCircle className="w-6 h-6 shrink-0" />
              <span>Anulación de garantía</span>
            </div>
            <ul className="space-y-3 font-mono text-xs sm:text-sm text-slate-300">
              {exclusiones.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* TIEMPOS DE RESPUESTA */}
        <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs sm:text-sm">
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
          <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-lg mx-auto leading-relaxed">
            Nuestro equipo de soporte técnico está disponible para atender tu caso personalmente.
          </p>

          {cleanPhone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar a soporte técnico vía WhatsApp"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold py-3 px-6 text-sm transition border border-emerald-400/30 shadow-lg shadow-emerald-950/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Contactar Soporte por WhatsApp
            </a>
          ) : (
            <p className="text-xs font-mono text-slate-500">
              Número de contacto no disponible momentáneamente.
            </p>
          )}
        </section>

      </div>
    </main>
  );
}