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
    icon: "⚡",
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
    <section className="border-b border-slate-900 bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
                gap-2.5
                rounded-xl
                border
                border-slate-800
                bg-slate-900/80
                px-4
                py-3.5
                text-xs
                font-mono
                font-bold
                text-slate-300
                backdrop-blur-md
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-cyan-500/50
                hover:bg-slate-900
                hover:text-cyan-400
                hover:shadow-[0_0_20px_rgba(6,182,212,0.18)]
                active:scale-[0.98]
              "
            >
              <span
                className="
                  text-base
                  transition-transform
                  duration-300
                  group-hover:scale-125
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
