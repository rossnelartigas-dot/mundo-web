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

  const inputStyles =
    "w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono";
  const labelStyles = "mb-1 block text-xs font-mono uppercase tracking-wider text-slate-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-8 shadow-2xl">
        
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Iniciar Sesión
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Ingresa tus credenciales para acceder a la plataforma.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs font-mono text-rose-400 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className={labelStyles}>
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              className={inputStyles}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelStyles}>
                Contraseña
              </label>
            </div>
            <input
              type="password"
              required
              className={inputStyles}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold py-2.5 text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-950 animate-ping" />
                Iniciando sesión...
              </span>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs font-mono text-slate-400">
          ¿No tienes una cuenta aún?{" "}
          <Link
            href="/register"
            className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>

      </div>
    </div>
  );
}