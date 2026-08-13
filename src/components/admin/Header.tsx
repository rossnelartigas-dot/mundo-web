"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaSignOutAlt } from "react-icons/fa";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-20 flex items-center justify-between px-8 text-slate-100 relative z-10">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
          Panel Administrativo
        </h1>
        <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest block">
          SYSTEM_ADMIN // ONLINE
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Info del Usuario */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
            A
          </div>
          <span className="font-medium text-slate-200 text-sm">
            Administrador
          </span>
        </div>

        {/* Separador visual */}
        <div className="h-6 w-px bg-slate-800"></div>

        {/* Botón de Cerrar Sesión */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-mono text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-50 px-3 py-1.5 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
          title="Cerrar sesión"
        >
          <FaSignOutAlt className="h-4 w-4" />
          <span>{loading ? "Saliendo..." : "Salir"}</span>
        </button>
      </div>
    </header>
  );
}
