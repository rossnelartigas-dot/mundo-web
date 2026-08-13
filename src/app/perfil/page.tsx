"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FaUser, FaEnvelope, FaPhone, FaSignOutAlt, FaShoppingBag, FaShieldAlt } from "react-icons/fa";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        // 1. Obtener sesión activa
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        const user = session.user;

        // 2. Cargar perfil usando maybeSingle()
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error al cargar perfil:", error);
        }

        if (data) {
          setProfile(data);
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
        } else {
          // Fallback en caso de no existir perfil aún
          const fallbackProfile: UserProfile = {
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || "",
            phone: "",
            role: "customer",
          };
          setProfile(fallbackProfile);
          setFullName(fallbackProfile.full_name);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [router]);

  // Actualizar o crear datos del perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage(null);

    const { error } = await supabase.from("profiles").upsert({
      id: profile.id,
      email: profile.email,
      full_name: fullName,
      phone: phone,
      role: profile.role || "customer",
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      console.error("Error al guardar perfil:", error);
      setMessage({ type: "error", text: "No se pudieron guardar los cambios: " + error.message });
    } else {
      setMessage({ type: "success", text: "¡Perfil actualizado con éxito!" });
      setProfile((prev) => (prev ? { ...prev, full_name: fullName, phone } : null));
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-900/80 px-6 py-4 shadow-2xl border border-slate-800 backdrop-blur-md">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
          <span className="text-xs font-mono text-slate-300">Cargando datos del perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Cabecera del Perfil */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-md gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-extrabold text-2xl shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <FaUser />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {profile?.full_name || "Usuario registrado"}
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{profile?.email}</p>
              {profile?.role === "admin" && (
                <span className="inline-flex items-center gap-1 mt-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-mono text-cyan-400">
                  <FaShieldAlt className="text-[10px]" /> Administrador
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-900/50 bg-rose-950/40 px-4 py-2 text-xs font-mono text-rose-400 hover:bg-rose-900/40 hover:border-rose-500/50 transition-all backdrop-blur-md"
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Notificaciones */}
        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-mono border backdrop-blur-md ${
              message.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                : "bg-rose-950/40 border-rose-500/40 text-rose-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Menú de Accesos Rápidos */}
          <div className="space-y-3">
            <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md space-y-2">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                Menú de Usuario
              </h2>
              <Link
                href="/carrito"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition text-slate-300 font-medium text-sm group"
              >
                <FaShoppingBag className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Ver Mi Carrito</span>
              </Link>
              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 hover:bg-cyan-500/10 transition text-cyan-400 font-medium text-sm group"
                >
                  <FaShieldAlt className="text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>Panel de Admin</span>
                </Link>
              )}
            </div>
          </div>

          {/* Formulario de Información Personal */}
          <div className="md:col-span-2">
            <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-md">
              <h2 className="text-base font-bold text-white mb-4">
                Información Personal
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-mono text-slate-300">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre y apellido"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-mono text-slate-300">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      disabled
                      className="w-full rounded-xl border border-slate-800/60 bg-slate-950/40 pl-10 pr-3 py-2.5 text-sm text-slate-500 cursor-not-allowed select-none"
                      value={profile?.email || ""}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] font-mono text-slate-500">
                    El correo electrónico está vinculado a tu cuenta y no puede cambiarse.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-mono text-slate-300">
                    Teléfono / WhatsApp
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <FaPhone />
                    </span>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+58 412 0000000"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-mono font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
