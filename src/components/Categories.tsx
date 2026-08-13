import Link from "next/link";
import {
  Monitor,
  Laptop,
  Cpu,
  Gamepad2,
  HardDrive,
  Router,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    name: "Monitores",
    icon: Monitor,
  },
  {
    name: "Laptops",
    icon: Laptop,
  },
  {
    name: "Computadoras",
    icon: Cpu,
  },
  {
    name: "Gaming",
    icon: Gamepad2,
  },
  {
    name: "Almacenamiento",
    icon: HardDrive,
  },
  {
    name: "Redes",
    icon: Router,
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 text-slate-100">
      {/* ENCABEZADO DE LA SECCIÓN */}
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            Explora nuestra tienda
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
            Compra por categoría
          </h2>

          <p className="mt-1 text-xs font-mono text-slate-400 max-w-2xl">
            Encuentra rápidamente los componentes y dispositivos que necesitas.
          </p>
        </div>

        <Link
          href="/categorias"
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            font-mono
            font-bold
            text-cyan-400
            transition-all
            hover:text-cyan-300
            hover:translate-x-1
            w-fit
          "
        >
          <span>Ver todas</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* GRILLA DE CATEGORÍAS */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.name}
              href={`/productos?categoria=${encodeURIComponent(category.name)}`}
              className="
                group
                relative
                flex
                min-h-[180px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/80
                p-5
                text-center
                backdrop-blur-md
                shadow-xl
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-cyan-500/50
                hover:bg-slate-900
                hover:shadow-[0_0_25px_rgba(6,182,212,0.18)]
              "
            >
              {/* ÍCONO CON GLOW */}
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-cyan-500/10
                  border
                  border-cyan-500/30
                  text-cyan-400
                  shadow-[0_0_15px_rgba(6,182,212,0.15)]
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:bg-cyan-500
                  group-hover:text-slate-950
                  group-hover:border-cyan-400
                  group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]
                "
              >
                <Icon size={28} strokeWidth={1.8} />
              </div>

              {/* TÍTULO */}
              <h3
                className="
                  mt-4
                  text-sm
                  font-bold
                  text-white
                  transition-colors
                  group-hover:text-cyan-400
                "
              >
                {category.name}
              </h3>

              {/* ACTION TEXT */}
              <span
                className="
                  mt-2
                  inline-flex
                  items-center
                  gap-1
                  text-[11px]
                  font-mono
                  text-slate-500
                  transition-colors
                  group-hover:text-cyan-300
                "
              >
                Ver productos
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
