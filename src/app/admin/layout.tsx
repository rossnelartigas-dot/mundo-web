"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAdminAuth() {
      // 1. Obtener la sesión activa
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // 2. Verificar el rol en la tabla 'profiles'
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || profile?.role !== "admin") {
        router.push("/"); // Redirige al home público si no es admin
      } else {
        setAuthorized(true);
      }
    }

    checkAdminAuth();
  }, [router]);

  // Pantalla de carga tecnológica durante la verificación de credenciales
  if (!authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden">
        {/* Glow ambiental de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="relative flex flex-col items-center gap-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl px-8 py-6 shadow-2xl border border-slate-800/80">
          <div className="relative flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400"></div>
            <div className="absolute h-5 w-5 animate-spin rounded-full border-2 border-cyan-300/20 border-b-cyan-300"></div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase animate-pulse">
              [ Autenticando acceso ]
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Verificando credenciales de administrador...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      {/* Fondo estático con gradiente oscuro para todo el panel */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-20 pointer-events-none" />

      {/* Sidebar del Admin */}
      <Sidebar />

      {/* Área principal del Dashboard */}
      <div className="flex-1 min-h-screen bg-slate-950/60 backdrop-blur-md flex flex-col border-l border-slate-800/80">
        <Header />
        <main className="p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
