"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  FolderTree,
  ShoppingCart,
  Users,
  Settings,
  ArrowLeft,
  Calculator,
  X,
} from "lucide-react";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Productos",
    icon: Package,
  },
  {
    href: "/admin/precios",
    label: "Precios y Descuentos",
    icon: Calculator,
  },
  {
    href: "/admin/inventario",
    label: "Inventario",
    icon: Boxes,
  },
  {
    href: "/admin/categories",
    label: "Categorías",
    icon: FolderTree,
  },
  {
    href: "/admin/orders",
    label: "Pedidos",
    icon: ShoppingCart,
  },
  {
    href: "/admin/customers",
    label: "Clientes",
    icon: Users,
  },
  {
    href: "/admin/settings",
    label: "Configuración",
    icon: Settings,
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop overlay para móvil */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen?.(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Contenedor del Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/80 text-white flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto lg:bg-slate-950/90
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          {/* Logo Principal + Botón Cerrar en móvil */}
          <div className="p-6 sm:p-8 flex items-center justify-between">
            <Link href="/" onClick={handleLinkClick} className="inline-block">
              <div className="text-2xl sm:text-3xl font-black tracking-wider text-white">
                Mundo <span className="text-cyan-400">Web</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">
                Control Panel
              </span>
            </Link>

            {/* Botón cerrar en móvil */}
            <button
              type="button"
              onClick={() => setMobileOpen?.(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 lg:hidden transition-colors"
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col space-y-1 px-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-cyan-400" : "text-slate-400"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Enlace para volver a la tienda */}
        <div className="p-4 border-t border-slate-800/80">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Volver a la Tienda</span>
          </Link>
        </div>
      </aside>
    </>
  );
}