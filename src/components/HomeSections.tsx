import Link from "next/link";

const links = [
  { href: "/productos", label: "Productos" },
  { href: "/categorias", label: "Categorías" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/contacto", label: "Contacto" },
];

export default function HomeSections() {
  return (
    <section className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-4 sm:px-6 lg:px-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
