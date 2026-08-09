"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <header className="bg-white shadow h-20 flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold">Panel Administrativo</h1>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-cyan-500"></div>

        <span>Administrador</span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition ml-2"
        >
          <LogOut size={20} />
          <span className="sr-only sm:not-sr-only">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}
