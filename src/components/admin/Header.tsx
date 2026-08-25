"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaSignOutAlt, FaBars } from "react-icons/fa";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
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
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 md:px-8 text-slate-100 relative z-20">
      <div className="flex items-center gap-3">
        {/* Botón Hamburguesa móvil */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all lg:hidden active:scale-95"
          aria-label="Abrir menú"
        >
          <FaBars size={16} />
        </button>

        <div>
          <h1 className="text-base sm:text-xl md:text-2xl font-extrabold text-white tracking-wide">
            Panel Administrativo
          </h1>
          <span className="hidden sm:block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest">
            SYSTEM_ADMIN // ONLINE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Info del Usuario */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20">
            A
          </div>
          <span className="hidden sm:inline font-medium text-slate-200 text-sm">
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
          className="flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-50 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
          title="Cerrar sesión"
        >
          <FaSignOutAlt className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">{loading ? "Saliendo..." : "Salir"}</span>
        </button>
      </div>
    </header>
  );
}
