"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaHome,
  FaEnvelope,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function LoginPage() {
  const router = useRouter();
  const { settings } = useStoreSettings();

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
  const labelStyles =
    "mb-1 block text-xs font-mono uppercase tracking-wider text-slate-400";

  // Formatear el número de WhatsApp para la URL
  const whatsappNumber = settings.whatsapp?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "#";

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-slate-950 p-4 sm:p-6 text-slate-100 bg-cyber-grid relative overflow-hidden">
      {/* Glow ambiental de fondo */}
      <div className="absolute inset-0 pointer-events-none bg-radial-glow" />
      <div className="absolute -top-40 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      {/* Barra superior de navegación (Home y Contacto) */}
      <div className="w-full max-w-md flex items-center justify-between pt-2 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono transition-all backdrop-blur-md hover:border-cyan-500/40"
        >
          <FaArrowLeft size={10} />
          <span>Inicio</span>
        </Link>

        <Link
          href="/contacto"
          className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono transition-all backdrop-blur-md hover:border-cyan-500/40"
        >
          <FaEnvelope size={11} />
          <span>Contacto</span>
        </Link>
      </div>

      {/* Tarjeta de Inicio de Sesión */}
      <div className="w-full max-w-md my-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-8 shadow-2xl z-10 relative overflow-hidden">
        {/* Línea láser superior */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3">
            <FaLock size={10} />
            Acceso Seguro
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
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
            className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold py-3 text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] disabled:opacity-50 disabled:cursor-not-allowed mt-2 active:scale-[0.99]"
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

      {/* Pie de página con accesos a WhatsApp y Redes Sociales */}
      <footer className="w-full max-w-md pt-4 pb-2 flex flex-col items-center gap-3 z-10">
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          {/* Botón Inicio */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono transition-all hover:border-slate-700"
          >
            <FaHome size={12} className="text-cyan-400" />
            <span>Inicio</span>
          </Link>

          {/* Botón Contacto */}
          <Link
            href="/contacto"
            className="inline-flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono transition-all hover:border-slate-700"
          >
            <FaEnvelope size={11} className="text-cyan-400" />
            <span>Contacto</span>
          </Link>

          {/* Botón WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-mono transition-all"
          >
            <FaWhatsapp size={13} />
            <span>WhatsApp</span>
          </a>

          {/* Facebook */}
          {settings.facebook && (
            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono transition-all hover:text-cyan-400"
            >
              <FaFacebook size={12} className="text-blue-400" />
              <span>Facebook</span>
            </a>
          )}

          {/* Instagram 1 */}
          {settings.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono transition-all hover:text-rose-400"
            >
              <FaInstagram size={12} className="text-rose-400" />
              <span>Instagram</span>
            </a>
          )}

          {/* Instagram 2 */}
          {settings.instagram2 && (
            <a
              href={settings.instagram2}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono transition-all hover:text-rose-400"
            >
              <FaInstagram size={12} className="text-rose-400" />
              <span>Instagram 2</span>
            </a>
          )}
        </div>

        <p className="text-[10px] font-mono text-slate-600">
          {settings.storeName || "Mundo Store"} © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}