import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Cpu,
  Zap,
  ShieldCheck,
  Activity,
  Terminal,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100 border-b border-slate-900 bg-cyber-grid">
      {/* LUCES Y GLOW DE FONDO */}
      <div className="absolute inset-0 pointer-events-none bg-radial-glow" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px] animate-pulse-slow" />
        <div className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* COLUMNA IZQUIERDA: TEXTO Y BOTONES */}
          <div className="max-w-3xl space-y-6">
            
            {/* BEACON STATUS BADGE */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-mono font-semibold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>HARDWARE EN LÍNEA</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-normal">MUNDO STORE</span>
            </div>

            {/* TITULO PRINCIPAL */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              Hardware avanzado que{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
                potencia tu mundo
              </span>
            </h1>

            {/* DESCRIPCIÓN */}
            <div className="space-y-2">
              <p className="text-base font-mono text-slate-300 sm:text-lg">
                Computadoras, laptops, procesadores, tarjetas gráficas, gaming, almacenamiento de alta velocidad y periféricos pro.
              </p>
              <p className="text-xs font-mono text-slate-400">
                Selección certificada con entrega inmediata, garantía de fábrica y soporte técnico especializado.
              </p>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="pt-2 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/productos"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2.5
                  rounded-xl
                  bg-cyan-500
                  px-7
                  py-3.5
                  text-xs
                  font-mono
                  font-bold
                  text-slate-950
                  shadow-[0_0_25px_rgba(6,182,212,0.35)]
                  transition-all
                  duration-300
                  hover:bg-cyan-400
                  hover:shadow-[0_0_35px_rgba(6,182,212,0.55)]
                  hover:-translate-y-0.5
                  active:scale-[0.98]
                "
              >
                <ShoppingBag size={18} />
                <span>EXPLORAR CATÁLOGO</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/ofertas"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/80
                  px-7
                  py-3.5
                  text-xs
                  font-mono
                  font-bold
                  text-slate-300
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:border-cyan-500/50
                  hover:text-cyan-400
                  hover:bg-slate-900
                  hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]
                  hover:-translate-y-0.5
                  active:scale-[0.98]
                "
              >
                <Zap size={15} className="text-cyan-400" />
                <span>OFERTAS FLASH</span>
              </Link>
            </div>

            {/* BENEFICIOS / FEATURES */}
            <div className="pt-6 grid grid-cols-1 gap-4 border-t border-slate-800/80 sm:grid-cols-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-white">
                    GARANTÍA TOTAL
                  </p>
                  <p className="mt-0.5 text-[11px] font-mono text-slate-400">
                    Artículos 100% nuevos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Zap size={14} />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-white">
                    DESPACHO RÁPIDO
                  </p>
                  <p className="mt-0.5 text-[11px] font-mono text-slate-400">
                    Envíos directos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Cpu size={14} />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-white">
                    ASESORÍA TÉCNICA
                  </p>
                  <p className="mt-0.5 text-[11px] font-mono text-slate-400">
                    Soporte especializado
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: PANEL VISUAL CYBER HUD */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl backdrop-blur-xl space-y-5 relative overflow-hidden">
                
                {/* LÍNEA LÁSER SUPERIOR */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                {/* HEADER DEL HUD */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                      <Terminal size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                        HUD // TELEMETRÍA
                      </p>
                      <h2 className="text-sm font-bold font-mono text-white">
                        Mundo Web Engine
                      </h2>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 font-mono text-[10px] font-bold text-emerald-400">
                    <Activity size={10} className="animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* MÉTRICAS TECNOLÓGICAS */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        Categorías
                      </span>
                      <Cpu size={12} className="text-cyan-400" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold font-mono text-white">
                      6+ Áreas
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Gaming, PC & Redes
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        Rendimiento
                      </span>
                      <Zap size={12} className="text-cyan-400" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold font-mono text-cyan-400">
                      Tier 1
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Componentes Pro
                    </p>
                  </div>
                </div>

                {/* CHIPS DE ESPECIFICACIONES */}
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Ecosistema soportado:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[10px] font-bold text-cyan-300">
                      [ RTX 40-SERIES ]
                    </span>
                    <span className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-300">
                      [ DDR5 6000MHz+ ]
                    </span>
                    <span className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-300">
                      [ NVMe Gen4/5 ]
                    </span>
                    <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[10px] font-bold text-cyan-300">
                      [ WI-FI 6E / 7 ]
                    </span>
                  </div>
                </div>

                {/* BANNER INFERIOR DE ACCESO RÁPIDO */}
                <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 to-slate-950/60 p-4 backdrop-blur-md flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono uppercase text-slate-400">
                      ¿Buscas armar tu PC?
                    </p>
                    <p className="text-xs font-mono font-bold text-cyan-400">
                      Contáctanos por WhatsApp
                    </p>
                  </div>
                  <Link
                    href="/contacto"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400 hover:scale-105"
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>

              </div>

              {/* ELEMENTOS DECORATIVOS SECUNDARIOS */}
              <div className="absolute -bottom-5 -left-5 h-20 w-20 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 blur-sm pointer-events-none" />
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-blue-500/20 blur-xl pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
