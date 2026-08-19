"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Home,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    total,
  } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const shipping = 0; // Envío gratuito por defecto
  const grandTotal = total + shipping;

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 py-16 text-slate-100 flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-md relative overflow-hidden">
            {/* Glow decorativo de fondo */}
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <ShoppingBag className="h-10 w-10 text-cyan-400" />
              </div>

              <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tu carrito está vacío
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-xs font-mono text-slate-400 leading-relaxed">
                Aún no has agregado productos. Explora nuestro catálogo de computación, seguridad y tecnología.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-5 py-3.5 text-xs font-mono font-semibold text-slate-300 transition-all hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                >
                  <Home className="h-4 w-4 text-cyan-400" />
                  Ir al Inicio
                </Link>

                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-xs font-mono font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  Explorar catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* BARRA SUPERIOR DE NAVEGACIÓN */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-800/80 pb-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-mono font-medium text-slate-300 transition-all hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95"
          >
            <Home className="h-4 w-4 text-cyan-400 transition-transform group-hover:scale-110" />
            <span>Volver al Inicio</span>
          </Link>

          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest hidden sm:inline-block">
            Mundo Web / Checkout Express
          </span>
        </div>

        {/* ENCABEZADO */}
        <div className="mb-8">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Resumen de Orden
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Carrito de compras
          </h1>

          <p className="mt-2 text-xs font-mono text-slate-400">
            Revisa tus productos y componentes antes de procesar el pedido.
          </p>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* LISTA DE PRODUCTOS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 shadow-xl backdrop-blur-md">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Lista de Artículos
              </h2>

              <span className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-mono font-bold text-cyan-400">
                {totalItems} {totalItems === 1 ? "ítem" : "ítems"}
              </span>
            </div>

            {cart.map((item) => {
              const itemSubtotal = (Number(item.price) || 0) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md transition-all hover:border-cyan-500/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    {/* IMAGEN DEL PRODUCTO */}
                    <div className="relative h-28 w-full sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center p-2">
                     <Image
  src={
    Array.isArray(item.image)
      ? item.image[0] || "/no-image.png"
      : item.image || item.image_url || "/no-image.png"
  }
  alt={item.name}
/>
                    </div>

                    {/* DETALLES Y ACCIONES */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          {item.category && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80 block mb-1">
                              {item.category}
                            </span>
                          )}
                          <h3 className="text-base font-bold text-white leading-snug">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-xs font-mono text-slate-400">
                            Unitario: ${Number(item.price).toFixed(2)}
                          </p>
                        </div>

                        {/* BOTÓN ELIMINAR */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-xl p-2 text-slate-500 transition-all hover:bg-rose-950/40 hover:text-rose-400 border border-transparent hover:border-rose-900/50 cursor-pointer"
                          title="Eliminar del carrito"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* CANTIDAD Y SUBTOTAL */}
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-800/60">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-400">
                            Cantidad:
                          </span>

                          <div className="flex items-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                              className="flex h-8 w-8 items-center justify-center text-slate-300 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>

                            <span className="flex h-8 min-w-[2.5rem] items-center justify-center border-x border-slate-800 px-2 text-xs font-mono font-bold text-cyan-400">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              className="flex h-8 w-8 items-center justify-center text-slate-300 transition hover:bg-slate-900 hover:text-white cursor-pointer"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                            Subtotal
                          </p>
                          <p className="text-base sm:text-lg font-extrabold text-cyan-400 font-mono">
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
            <div className="pt-3">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 transition-all hover:text-cyan-400"
              >
                ← Seguir explorando productos
              </Link>
            </div>
          </section>

          {/* RESUMEN DE LA COMPRA */}
          <aside className="lg:sticky lg:top-6 lg:h-fit space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-lg font-bold text-white border-b border-slate-800/80 pb-4">
                Resumen de Compra
              </h2>

              <div className="mt-5 space-y-3.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal productos</span>
                  <span className="text-slate-200 font-bold">${total.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-cyan-400" />
                    Envío
                  </span>
                  <span className="font-bold text-emerald-400">Gratis</span>
                </div>
              </div>

              <div className="my-5 border-t border-slate-800" />

              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">Total</span>
                <span className="text-2xl font-extrabold text-cyan-400 font-mono drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 text-xs font-mono font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                Procesar Pago
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* GARANTÍA / CONFIANZA */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 text-xs font-mono text-slate-400 space-y-2 backdrop-blur-md">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Compra 100% Segura</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Garantía directa con Mundo Web. Soporte post-venta y envío protegido.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}