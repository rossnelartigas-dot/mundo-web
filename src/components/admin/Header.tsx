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
    <header className="bg-white shadow h-20 flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold">
        Panel Administrativo
      </h1>

      <div className="flex items-center gap-6">
        {/* Info del Usuario */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-medium text-slate-700">
            Administrador
          </span>
        </div>

        {/* Separador visual */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* Botón de Cerrar Sesión */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors disabled:opacity-50"
          title="Cerrar sesión"
        >
          <FaSignOutAlt className="h-4 w-4" />
          <span>{loading ? "Saliendo..." : "Salir"}</span>
        </button>
      </div>
    </header>
  );
}