"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Autenticar con Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      if (authError.message.includes("Invalid login credentials")) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Obtener el rol desde la tabla profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      setLoading(false);

      // Refrescar el estado del router para aplicar la sesión
      router.refresh();

      // 3. Redireccionar según el rol
      if (profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/"); // Redirige al inicio
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Iniciar Sesión</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
            </div>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-600 py-2.5 font-medium text-white hover:bg-cyan-700 transition disabled:opacity-50"
          >
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿No tienes una cuenta aún?{" "}
          <Link
            href="/register"
            className="font-semibold text-cyan-600 hover:text-cyan-700 hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}