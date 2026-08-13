"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    total,
  } = useCart();

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const shipping = 0;
  const grandTotal = total + shipping;

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 py-12 text-slate-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-16 text-center shadow-2xl backdrop-blur-md sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <ShoppingBag className="h-10 w-10 text-cyan-400" />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
              Tu carrito está vacío
            </h1>

            <p className="mx-auto mt-3 max-w-md text-xs font-mono text-slate-400">
              Todavía no has agregado productos. Explora nuestra tienda y
              encuentra lo que necesitas.
            </p>

            <Link
              href="/productos"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-3.5 text-xs font-mono font-bold text-slate-950 transition hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Ver productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ENCABEZADO */}

        <div className="mb-8">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Mundo Web
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Carrito de compras
          </h1>

          <p className="mt-2 text-xs font-mono text-slate-400">
            Revisa tus productos antes de continuar con tu compra.
          </p>
        </div>

        {/* CONTENIDO */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* PRODUCTOS */}

          <section className="space-y-4">

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">
                  Productos
                </h2>

                <span className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-mono font-bold text-cyan-400">
                  {totalItems}{" "}
                  {totalItems === 1 ? "producto" : "productos"}
                </span>
              </div>
            </div>

            {cart.map((item) => {
              const itemSubtotal = item.price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl backdrop-blur-md transition hover:border-cyan-500/40 sm:p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                    {/* IMAGEN */}

                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80 sm:h-28 sm:w-28">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name || "Producto"}
                        fill
                        sizes="112px"
                        className="object-contain p-2"
                      />
                    </div>

                    {/* INFORMACIÓN */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-xs font-mono text-slate-400">
                            Precio unitario: ${Number(item.price).toFixed(2)}
                          </p>
                        </div>

                        {/* ELIMINAR */}

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-950/40 hover:text-rose-400 border border-transparent hover:border-rose-900/50"
                          title="Eliminar producto"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* CANTIDAD Y SUBTOTAL */}

                      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                          <span className="text-xs font-mono text-slate-400">
                            Cantidad
                          </span>

                          <div className="flex items-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950">

                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                              className="flex h-9 w-9 items-center justify-center text-slate-300 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-slate-800 px-3 text-xs font-mono font-bold text-cyan-400">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              className="flex h-9 w-9 items-center justify-center text-slate-300 transition hover:bg-slate-900 hover:text-white"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-4 w-4" />
                            </button>

                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                            Subtotal
                          </p>

                          <p className="mt-0.5 text-lg font-extrabold text-cyan-400 font-mono">
                            ${itemSubtotal.toFixed(2)}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* SEGUIR COMPRANDO */}

            <div className="pt-2">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 transition hover:text-cyan-300"
              >
                ← Seguir comprando
              </Link>
            </div>
          </section>

          {/* RESUMEN */}

          <aside className="lg:sticky lg:top-6 lg:h-fit">

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">

              <h2 className="text-lg font-bold text-white">
                Resumen de compra
              </h2>

              <div className="mt-6 space-y-4 text-xs font-mono">

                <div className="flex items-center justify-between text-slate-400">
                  <span>Productos</span>
                  <span className="text-slate-200">{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-200">${total.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Envío</span>
                  <span className="font-bold text-emerald-400">
                    Gratis
                  </span>
                </div>

              </div>

              <div className="my-6 border-t border-slate-800" />

              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">
                  Total
                </span>

                <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 text-xs font-mono font-bold text-slate-950 transition hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                Continuar compra
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-4 text-center text-[11px] font-mono leading-5 text-slate-500">
                Revisa tus productos y datos antes de confirmar tu pedido.
              </p>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}
