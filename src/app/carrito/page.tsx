"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    total,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-5">Carrito vacío</h1>
        <p className="mb-5">No tienes productos agregados.</p>
        <Link href="/" className="bg-cyan-500 text-white px-6 py-3 rounded-lg">
          Volver a comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>

      <div className="space-y-5">
        {cart.map((it) => (
          <div key={it.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={it.image ?? "/placeholder.png"}
                alt={it.name ?? "product"}
                width={80}
                height={80}
                className="object-cover"
              />
              <div className="ml-4">
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-slate-500">${it.price}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => decreaseQuantity(it.id)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                −
              </button>

              <div>{it.quantity}</div>

              <button
                onClick={() => increaseQuantity(it.id)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(it.id)}
                className="ml-4 text-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-slate-100 p-6 rounded-xl">
        <h2 className="text-2xl font-bold">
          Total: <span className="text-cyan-600">${total}</span>
        </h2>

        <Link
          href="/checkout"
          className="inline-block mt-5 bg-cyan-600 text-white px-8 py-3 rounded-lg"
        >
          Continuar compra
        </Link>
      </div>
    </div>
  );
}