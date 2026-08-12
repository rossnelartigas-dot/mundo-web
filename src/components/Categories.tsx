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
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Explora nuestra tienda
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Compra por categoría
          </h2>

          <p className="mt-2 max-w-2xl text-slate-500">
            Encuentra rápidamente los productos que necesitas.
          </p>
        </div>

        <Link
          href="/categorias"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-cyan-600
            transition
            hover:text-cyan-700
          "
        >
          Ver todas
          <ArrowRight size={17} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.name}
              href={`/productos?categoria=${encodeURIComponent(
                category.name
              )}`}
              className="
                group
                flex
                min-h-[170px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                text-center
                shadow-sm
                transition
                duration-300
                hover:-translate-y-1
                hover:border-cyan-200
                hover:shadow-xl
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-cyan-50
                  text-cyan-500
                  transition
                  duration-300
                  group-hover:bg-cyan-500
                  group-hover:text-white
                "
              >
                <Icon size={32} strokeWidth={1.8} />
              </div>

              <h3
                className="
                  mt-5
                  text-sm
                  font-bold
                  text-slate-800
                  transition
                  group-hover:text-cyan-600
                "
              >
                {category.name}
              </h3>

              <span
                className="
                  mt-2
                  inline-flex
                  items-center
                  gap-1
                  text-xs
                  font-medium
                  text-slate-400
                  transition
                  group-hover:text-cyan-500
                "
              >
                Ver productos
                <ArrowRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}