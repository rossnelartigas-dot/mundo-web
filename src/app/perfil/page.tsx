"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FaUser, FaEnvelope, FaPhone, FaSignOutAlt, FaShoppingBag } from "react-icons/fa";

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

        // 2. Cargar perfil usando maybeSingle() para evitar lanzar excepciones si la fila no existe
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
          // Si aún no existe en la tabla profiles, creamos un fallback con la data de auth
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-sm border border-slate-200">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent"></div>
          <span className="text-sm font-medium text-slate-600">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Cabecera del Perfil */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl p-6 border border-slate-200 shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-2xl shadow-inner">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <FaUser />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {profile?.full_name || "Usuario de la Tienda"}
              </h1>
              <p className="text-sm text-slate-500">{profile?.email}</p>
              {profile?.role === "admin" && (
                <span className="inline-block mt-1 rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800">
                  Administrador
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Notificación de Éxito o Error */}
        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Accesos Rápidos */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Menú
              </h2>
              <Link
                href="/carrito"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition text-slate-700 font-medium text-sm"
              >
                <FaShoppingBag className="text-cyan-600" />
                <span>Ver Mi Carrito</span>
              </Link>
              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-cyan-50 transition text-cyan-700 font-medium text-sm"
                >
                  <FaUser className="text-cyan-600" />
                  <span>Ir al Panel Admin</span>
                </Link>
              )}
            </div>
          </div>

          {/* Formulario de Información Personal */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Información Personal
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre y apellido"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      disabled
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-slate-500 cursor-not-allowed"
                      value={profile?.email || ""}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    El correo electrónico no se puede modificar directamente.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Teléfono / WhatsApp
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <FaPhone />
                    </span>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+58 412 0000000"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-cyan-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 transition disabled:opacity-50"
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