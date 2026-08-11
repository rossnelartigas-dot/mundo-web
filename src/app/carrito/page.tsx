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
      <main className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-50">
              <ShoppingBag className="h-10 w-10 text-cyan-600" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Tu carrito está vacío
            </h1>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Todavía no has agregado productos. Explora nuestra tienda y
              encuentra lo que necesitas.
            </p>

            <Link
              href="/productos"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-7 py-3.5 font-semibold text-white transition hover:bg-cyan-700"
            >
              Ver productos
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ENCABEZADO */}

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
            Mundo Web
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Carrito de compras
          </h1>

          <p className="mt-2 text-slate-500">
            Revisa tus productos antes de continuar con tu compra.
          </p>
        </div>

        {/* CONTENIDO */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* PRODUCTOS */}

          <section className="space-y-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Productos
                </h2>

                <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">
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
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                    {/* IMAGEN */}

                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">
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
                          <h3 className="text-lg font-semibold text-slate-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Precio unitario: ${Number(item.price).toFixed(2)}
                          </p>
                        </div>

                        {/* ELIMINAR */}

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Eliminar producto"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* CANTIDAD Y SUBTOTAL */}

                      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                          <span className="text-sm font-medium text-slate-600">
                            Cantidad
                          </span>

                          <div className="flex items-center overflow-hidden rounded-lg border border-slate-300">

                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                              className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-slate-300 px-3 text-sm font-semibold text-slate-900">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:bg-slate-100"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-4 w-4" />
                            </button>

                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Subtotal
                          </p>

                          <p className="mt-1 text-xl font-bold text-cyan-600">
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
                className="inline-flex items-center gap-2 font-medium text-cyan-600 transition hover:text-cyan-700"
              >
                ← Seguir comprando
              </Link>
            </div>
          </section>

          {/* RESUMEN */}

          <aside className="lg:sticky lg:top-6 lg:h-fit">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-slate-900">
                Resumen de compra
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between text-slate-600">
                  <span>Productos</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Envío</span>
                  <span className="font-medium text-green-600">
                    Gratis
                  </span>
                </div>

              </div>

              <div className="my-6 border-t border-slate-200" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">
                  Total
                </span>

                <span className="text-3xl font-bold text-cyan-600">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-cyan-700 hover:shadow-md"
              >
                Continuar compra
                <ArrowRight className="h-5 w-5" />
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Revisa tus productos y datos antes de confirmar tu pedido.
              </p>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}
