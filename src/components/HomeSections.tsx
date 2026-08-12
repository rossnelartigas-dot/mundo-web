import Link from "next/link";

const links = [
  {
    href: "/productos",
    label: "Productos",
    icon: "🛒",
  },
  {
    href: "/categorias",
    label: "Categorías",
    icon: "▦",
  },
  {
    href: "/ofertas",
    label: "Ofertas",
    icon: "🔥",
  },
  {
    href: "/consultar-pedido",
    label: "Consultar pedido",
    icon: "📦",
  },
  {
    href: "/contacto",
    label: "Contacto",
    icon: "✉",
  },
];

export default function HomeSections() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                group
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                font-semibold
                text-slate-700
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-cyan-400
                hover:bg-cyan-50
                hover:text-cyan-700
                hover:shadow-sm
              "
            >
              <span
                className="
                  text-lg
                  transition-transform
                  duration-200
                  group-hover:scale-110
                "
              >
                {link.icon}
              </span>

              <span>{link.label}</span>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}