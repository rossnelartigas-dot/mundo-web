import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100 border-b border-slate-900">
      {/* LUGES Y GLOW DE FONDO */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* COLUMNA IZQUIERDA: TEXTO Y BOTONES */}
          <div className="max-w-3xl space-y-6">
            
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-mono font-bold text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md">
              <Sparkles size={14} />
              <span>Tecnología para tu mundo</span>
            </div>

            {/* TITULO PRINCIPAL */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              La tecnología que{" "}
              <span className="block text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                impulsa tu mundo
              </span>
            </h1>

            {/* DESCRIPCIÓN */}
            <div className="space-y-2">
              <p className="text-base font-mono text-slate-300 sm:text-lg">
                Computadoras, laptops, monitores, accesorios, gaming, almacenamiento, redes y mucho más.
              </p>
              <p className="text-xs font-mono text-slate-400">
                Encuentra el hardware de alto rendimiento que necesitas para trabajar, estudiar, jugar y crear.
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
                  gap-2
                  rounded-xl
                  bg-cyan-500
                  px-7
                  py-3.5
                  text-xs
                  font-mono
                  font-bold
                  text-slate-950
                  shadow-[0_0_20px_rgba(6,182,212,0.3)]
                  transition-all
                  duration-300
                  hover:bg-cyan-400
                  hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]
                  active:scale-[0.98]
                "
              >
                <ShoppingBag size={18} />
                <span>COMPRAR AHORA</span>
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
                  hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]
                  active:scale-[0.98]
                "
              >
                VER OFERTAS
              </Link>
            </div>

            {/* BENEFICIOS / FEATURES */}
            <div className="pt-6 grid grid-cols-1 gap-4 border-t border-slate-800/80 sm:grid-cols-3">
              <div>
                <p className="text-xs font-mono font-bold text-white">
                  PRODUCTOS DE CALIDAD
                </p>
                <p className="mt-1 text-[11px] font-mono text-slate-400">
                  Hardware garantizado
                </p>
              </div>

              <div>
                <p className="text-xs font-mono font-bold text-white">
                  COMPRA RÁPIDA
                </p>
                <p className="mt-1 text-[11px] font-mono text-slate-400">
                  Proceso simple y directo
                </p>
              </div>

              <div>
                <p className="text-xs font-mono font-bold text-white">
                  ATENCIÓN DIRECTA
                </p>
                <p className="mt-1 text-[11px] font-mono text-slate-400">
                  Soporte personalizado
                </p>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: PANEL VISUAL CYBERPUNK */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                      Plataforma Mundo Web
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-white">
                      Tecnología
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <ShoppingBag size={24} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 backdrop-blur-md">
                    <p className="text-[10px] font-mono uppercase text-slate-400">
                      Categorías
                    </p>
                    <p className="mt-2 text-3xl font-extrabold font-mono text-white">
                      6+
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 backdrop-blur-md">
                    <p className="text-[10px] font-mono uppercase text-slate-400">
                      Ofertas
                    </p>
                    <p className="mt-2 text-3xl font-extrabold font-mono text-cyan-400">
                      ⚡
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 backdrop-blur-md space-y-1">
                  <p className="text-[10px] font-mono uppercase text-slate-400">
                    Encuentra lo que buscas
                  </p>
                  <p className="text-xs font-mono font-bold text-cyan-400">
                    Computación · Gaming · Redes
                  </p>
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
