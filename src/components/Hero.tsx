import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Fondo decorativo */}
      <div className="absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Contenido */}
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <Sparkles size={16} />
              Tecnología para tu mundo
            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              La tecnología que
              <span className="block text-cyan-400">
                impulsa tu mundo
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Computadoras, laptops, monitores, accesorios, gaming,
              almacenamiento, redes y mucho más.
            </p>

            <p className="mt-3 text-base text-slate-400">
              Encuentra el equipo que necesitas para trabajar, estudiar,
              jugar y disfrutar de la tecnología.
            </p>

            {/* Botones */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
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
                  py-4
                  text-base
                  font-bold
                  text-slate-950
                  shadow-lg
                  shadow-cyan-500/20
                  transition
                  hover:bg-cyan-400
                  hover:shadow-cyan-400/30
                "
              >
                <ShoppingBag size={20} />
                Comprar ahora
                <ArrowRight size={18} />
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
                  border-slate-600
                  bg-white/5
                  px-7
                  py-4
                  text-base
                  font-semibold
                  text-white
                  backdrop-blur
                  transition
                  hover:border-cyan-400
                  hover:bg-white/10
                  hover:text-cyan-300
                "
              >
                Ver ofertas
              </Link>
            </div>

            {/* Beneficios */}
            <div className="mt-10 grid grid-cols-1 gap-4 border-t border-slate-800 pt-8 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-white">
                  Productos de calidad
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Tecnología seleccionada
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">
                  Compra fácil
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Proceso rápido y sencillo
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">
                  Atención personalizada
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Estamos para ayudarte
                </p>
              </div>
            </div>
          </div>

          {/* Panel visual */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Mundo Web
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">
                      Tecnología
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                    <ShoppingBag size={25} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
                    <p className="text-sm text-slate-400">
                      Categorías
                    </p>
                    <p className="mt-2 text-3xl font-bold text-white">
                      6+
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
                    <p className="text-sm text-slate-400">
                      Ofertas
                    </p>
                    <p className="mt-2 text-3xl font-bold text-cyan-400">
                      🔥
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 p-5">
                  <p className="text-sm text-slate-400">
                    Encuentra lo que necesitas
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    Computación · Gaming · Redes
                  </p>
                </div>
              </div>

              {/* Elemento decorativo */}
              <div className="absolute -bottom-5 -left-5 h-20 w-20 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 blur-sm" />
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-blue-500/20 blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}