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
    ArrowLeft
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

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-slate-950/90 backdrop-blur-md border-r border-slate-800/80 text-white min-h-screen flex flex-col justify-between shrink-0">

            <div>
                {/* Logo Principal */}
                <div className="p-8">
                    <Link href="/" className="inline-block">
                        <div className="text-3xl font-black tracking-wider text-white">
                            Mundo <span className="text-cyan-400">Web</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">
                            Control Panel
                        </span>
                    </Link>
                </div>

                {/* Navegación */}
                <nav className="flex flex-col space-y-1 px-4">
                    {links.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold"
                                        : "text-slate-400 hover:text-white hover:bg-slate-900/80"
                                }`}
                            >
                                <Icon size={20} className={isActive ? "text-cyan-400" : "text-slate-400"} />
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span>Volver a la Tienda</span>
                </Link>
            </div>

        </aside>
    );
}