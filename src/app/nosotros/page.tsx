import Link from "next/link";
import { 
  ShieldCheck, 
  Cpu, 
  Camera, 
  Monitor, 
  Headphones, 
  Truck, 
  CheckCircle2, 
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  Mail
} from "lucide-react";

import { supabase } from "@/lib/supabase"; // Ajusta el path a tu cliente de Supabase

export const revalidate = 60; // Revalida los datos de Supabase cada 60 segundos

async function getSettingsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) {
      console.error("Error al obtener las configuraciones de Supabase:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error al conectar con Supabase:", err);
    return null;
  }
}

export default async function NosotrosPage() {
  // 1. Consulta directa a Supabase
  const settings = await getSettingsFromSupabase();

  // 2. Extracción de datos
  const rawPhone = settings?.whatsapp_phone || settings?.phone || settings?.whatsapp || "";
  const cleanPhone = rawPhone.replace(/\D/g, ""); // Mantiene solo dígitos
  const email = settings?.email || settings?.contact_email || "contacto@mundoweb.com";
  const storeName = settings?.store_name || "Mundo Web";

  // 3. Generación del mensaje y link de WhatsApp
  const whatsappMessage = encodeURIComponent(
    `Hola, estuve viendo la sección Nosotros en ${storeName} y me gustaría recibir asesoría.`
  );

  const whatsappUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${whatsappMessage}`
    : null;

  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-10">
        
        {/* BARRA DE NAVEGACIÓN Y ACCIONES RÁPIDAS */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white font-mono font-semibold py-2 px-4 text-xs sm:text-sm transition border border-slate-800 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            Volver al Inicio
          </Link>

          <div className="flex items-center gap-2">
            {/* Enlace de Correo Directo (mailto) */}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-mono text-xs sm:text-sm py-2 px-3.5 transition border border-slate-800"
                title={`Enviar correo a ${email}`}
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">{email}</span>
                <span className="sm:hidden">Correo</span>
              </a>
            )}

            {/* Enlace dinámico a WhatsApp desde Supabase */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold py-2 px-4 text-xs sm:text-sm transition border border-emerald-400/30 shadow-lg shadow-emerald-950/40"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                WhatsApp Directo
              </a>
            )}
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
            {storeName} • Soluciones Tecnológicas
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Impulsamos tu entorno con <span className="text-cyan-400">Tecnología y Seguridad</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-xs sm:text-sm font-mono leading-relaxed">
            Especialistas en la venta y asesoría de equipos completos de computación, sistemas de videovigilancia y hardware de alto rendimiento para proyectos personales, comercios y empresas.
          </p>
        </section>

        {/* ESPECIALIDADES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md hover:border-cyan-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Monitor className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Equipos Completos</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              CPUs armados a medida, computadoras All-in-One, Mini PCs y laptops para trabajo, estudio o alto rendimiento.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md hover:border-cyan-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cámaras y Seguridad</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Sistemas de videovigilancia, cámaras de seguridad IP/CCTV y kits de monitoreo para hogares y negocios.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md hover:border-cyan-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Componentes y Hardware</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Monitores, piezas de actualización, periferia y componentes garantizados de las mejores marcas.
            </p>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-md space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight text-center sm:text-left">
            ¿Por qué elegir {storeName}?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-mono text-slate-300">
            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-1">Garantía Asegurada</span>
                <span>Respaldamos cada equipo y producto que vendemos con garantía directa y soporte técnico.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <Headphones className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-1">Asesoría Técnica</span>
                <span>Te guiamos en la elección de los componentes o sistemas que mejor se adapten a tu presupuesto.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <Truck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-1">Envíos y Logística</span>
                <span>Despacho rápido y seguro para que recibas tus equipos en perfecto estado.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-1">Soluciones a Medida</span>
                <span>Preparamos cotizaciones especiales para proyectos corporativos, comercios o armado de PC personal.</span>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="text-center p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden space-y-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">¿Listo para equipar tu hogar o negocio?</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-lg mx-auto">
              Explora nuestro catálogo en línea o contáctanos directamente por WhatsApp para solicitar una cotización.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold py-3 px-5 text-sm transition border border-emerald-400/30 shadow-lg shadow-emerald-950/50"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Cotizar por WhatsApp
              </a>
            )}

            <Link
              href="/productos"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-semibold py-3 px-5 text-sm transition border border-cyan-400/30 shadow-lg shadow-cyan-950/50"
            >
              <ShoppingBag className="w-4 h-4" />
              Ver Productos
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}