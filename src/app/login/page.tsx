"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      // Genericize the credential signal to avoid account enumeration,
      // but surface actionable states (unconfirmed email, rate limits).
      const code = signInError.message.toLowerCase();
      if (code.includes("email not confirmed")) {
        setError(
          "Debes confirmar tu correo electrónico antes de iniciar sesión.",
        );
      } else if (code.includes("rate") || code.includes("too many")) {
        setError(
          "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
        );
      } else if (code.includes("invalid")) {
        setError("Correo electrónico o contraseña incorrectos.");
      } else {
        setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-cyan-600 mb-8">
          Mundo Web
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="********"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white py-3 rounded-lg font-bold transition"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </main>
  );
}
