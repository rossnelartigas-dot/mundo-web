"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsultarPedidoPage() {
  const router = useRouter();

  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!orderId.trim() || !email.trim()) {
      alert("Ingresa el número de pedido y el correo electrónico.");
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
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-xl px-4 sm:px-6">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Consultar pedido
            </h1>

            <p className="mt-3 text-slate-600">
              Introduce los datos utilizados al realizar tu compra.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>
              <label
                htmlFor="orderId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Número de pedido
              </label>

              <input
                id="orderId"
                type="number"
                min="1"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Ejemplo: 125"
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-cyan-500
                  focus:ring-2
                  focus:ring-cyan-100
                "
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-cyan-500
                  focus:ring-2
                  focus:ring-cyan-100
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-lg
                bg-cyan-600
                px-5
                py-3
                font-medium
                text-white
                transition
                hover:bg-cyan-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? "Consultando..."
                : "Consultar pedido"}
            </button>

          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm text-cyan-600 hover:text-cyan-700"
            >
              ← Volver a la tienda
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}