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

  // Mientras valida la sesión, muestra una pantalla de carga para no revelar contenido privado
  if (!authorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-sm border border-slate-200">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent"></div>
          <span className="text-sm font-medium text-slate-600">
            Verificando permisos...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-slate-100 min-h-screen">
        <Header />
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}