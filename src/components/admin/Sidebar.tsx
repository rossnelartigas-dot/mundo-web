"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    Users,
    Settings
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
    return (
        <aside className="w-72 bg-slate-900 text-white min-h-screen">

            <div className="text-3xl font-bold p-8 text-cyan-400">
                Mundo Web
            </div>

            <nav className="flex flex-col">

                {links.map((item) => {

                    const Icon = item.icon;

                    return (

                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-4 px-8 py-4 hover:bg-slate-800 transition"
                        >

                            <Icon size={20} />

                            {item.label}

                        </Link>

                    );

                })}

            </nav>

        </aside>
    );
}