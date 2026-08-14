"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Hash, Mail, ArrowLeft, Loader2, PackageCheck } from "lucide-react";

export default function ConsultarPedidoPage() {
  const router = useRouter();

  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!orderId.trim() || !email.trim()) {
      setError("Por favor, ingresa el número de pedido y el correo electrónico.");
      return;
    }

    setLoading(true);

    router.push(
      `/pedido/${encodeURIComponent(orderId.trim())}?email=${encodeURIComponent(
        email.trim().toLowerCase()
      )}`
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 flex items-center justify-center text-slate-100">
      <div className="w-full max-w-md">

        {/* Tarjeta Principal */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          {/* Adorno Neón Superior */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Consultar Pedido
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Introduce los datos asociados a tu compra para verificar su estado en tiempo real.
            </p>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="mt-6 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono text-center">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            
            {/* Campo Número de Pedido */}
            <div className="space-y-2">
              <label
                htmlFor="orderId"
                className="block text-xs font-mono text-slate-300 uppercase tracking-wider"
              >
                Número de pedido
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  id="orderId"
                  type="number"
                  min="1"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Ej: 125"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Campo Correo Electrónico */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-mono text-slate-300 uppercase tracking-wider"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Botón Consultar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-semibold py-3 px-5 transition duration-200 border border-cyan-400/30 shadow-lg shadow-cyan-950/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Consultando...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Consultar Pedido</span>
                </>
              )}
            </button>

          </form>

          {/* Botón Volver */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la tienda</span>
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}