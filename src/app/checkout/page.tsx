"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/orderService";

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cart,
    total,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    if (
      !form.customer_name.trim() ||
      !form.customer_phone.trim() ||
      !form.customer_email.trim() ||
      !form.customer_address.trim()
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const order = await createOrder({
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        customer_email: form.customer_email.trim(),
        customer_address: form.customer_address.trim(),
        products: cart,
        total,
      });

      clearCart();

      /*
       * IMPORTANTE:
       * Enviamos el correo junto con el ID del pedido.
       * Esto permite que pedido/[id]/page.tsx
       * valide que el pedido pertenece al cliente.
       */
      router.push(
        `/pedido/${order.id}?email=${encodeURIComponent(
          form.customer_email.trim()
        )}`
      );
    } catch (error) {
      console.error(
        "Error creando pedido:",
        error
      );

      alert(
        "No se pudo crear el pedido. Por favor intenta nuevamente."
      );

      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
              🛒
            </div>

            <h1 className="mt-5 text-3xl font-bold text-slate-900">
              Tu carrito está vacío
            </h1>

            <p className="mt-3 text-slate-500">
              Agrega productos al carrito antes de continuar con
              la compra.
            </p>

            <button
              type="button"
              onClick={() => router.push("/productos")}
              className="
                mt-6
                inline-flex
                rounded-lg
                bg-cyan-500
                px-6
                py-3
                font-semibold
                text-white
                transition
                hover:bg-cyan-600
              "
            >
              Ver productos
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* TÍTULO */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Finalizar compra
          </h1>

          <p className="mt-2 text-slate-500">
            Completa tus datos para registrar tu pedido.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-3"
        >

          {/* DATOS DEL CLIENTE */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-7">
                <h2 className="text-2xl font-bold text-slate-900">
                  Datos del cliente
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Utilizaremos estos datos para procesar y
                  consultar tu pedido.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* NOMBRE */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="customer_name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nombre completo
                  </label>

                  <input
                    id="customer_name"
                    name="customer_name"
                    type="text"
                    value={form.customer_name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    disabled={loading}
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-100
                      disabled:bg-slate-100
                    "
                  />
                </div>

                {/* TELÉFONO */}
                <div>
                  <label
                    htmlFor="customer_phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Teléfono
                  </label>

                  <input
                    id="customer_phone"
                    name="customer_phone"
                    type="tel"
                    value={form.customer_phone}
                    onChange={handleChange}
                    placeholder="+58 412 000 0000"
                    disabled={loading}
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-100
                      disabled:bg-slate-100
                    "
                  />
                </div>

                {/* CORREO */}
                <div>
                  <label
                    htmlFor="customer_email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Correo electrónico
                  </label>

                  <input
                    id="customer_email"
                    name="customer_email"
                    type="email"
                    value={form.customer_email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    disabled={loading}
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-100
                      disabled:bg-slate-100
                    "
                  />
                </div>

                {/* DIRECCIÓN */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="customer_address"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Dirección de entrega
                  </label>

                  <textarea
                    id="customer_address"
                    name="customer_address"
                    value={form.customer_address}
                    onChange={handleChange}
                    placeholder="Escribe la dirección donde deseas recibir tu pedido"
                    disabled={loading}
                    required
                    rows={4}
                    className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-100
                      disabled:bg-slate-100
                    "
                  />
                </div>

              </div>

              {/* AVISO */}
              <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
                <p className="text-sm leading-6 text-cyan-800">
                  <strong>Importante:</strong> utiliza un correo
                  electrónico válido. Lo necesitarás junto con
                  el número de pedido para consultar el estado
                  de tu compra posteriormente.
                </p>
              </div>

            </div>
          </div>

          {/* RESUMEN */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-2xl font-bold text-slate-900">
                Resumen de compra
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {cart.length}{" "}
                {cart.length === 1
                  ? "producto"
                  : "productos"}
              </p>

              {/* PRODUCTOS */}
              <div className="mt-6 space-y-5">

                {cart.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4"
                  >

                    {/* IMAGEN */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl text-slate-400">
                          📦
                        </div>
                      )}
                    </div>

                    {/* INFORMACIÓN */}
                    <div className="min-w-0 flex-1">

                      <p className="font-semibold text-slate-800">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Cantidad: {product.quantity}
                      </p>

                      <p className="mt-1 font-semibold text-cyan-600">
                        $
                        {(
                          Number(product.price) *
                          product.quantity
                        ).toFixed(2)}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

              {/* LÍNEA */}
              <div className="my-6 border-t border-slate-200" />

              {/* SUBTOTAL */}
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>

                <span className="font-medium">
                  ${Number(total).toFixed(2)}
                </span>
              </div>

              {/* ENVÍO */}
              <div className="mt-3 flex items-center justify-between text-slate-600">
                <span>Envío</span>

                <span className="font-medium">
                  Por confirmar
                </span>
              </div>

              {/* TOTAL */}
              <div className="mt-5 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between">

                  <span className="text-xl font-bold text-slate-900">
                    Total
                  </span>

                  <span className="text-3xl font-bold text-cyan-600">
                    ${Number(total).toFixed(2)}
                  </span>

                </div>
              </div>

              {/* BOTÓN */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-6
                  w-full
                  rounded-xl
                  bg-cyan-500
                  px-5
                  py-4
                  text-base
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-cyan-600
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading
                  ? "Procesando pedido..."
                  : "Confirmar pedido"}
              </button>

              {/* SEGURIDAD */}
              <div className="mt-5 text-center">
                <p className="text-xs leading-5 text-slate-400">
                  Al confirmar tu pedido, tus datos serán
                  utilizados para procesar la compra y permitirte
                  consultar el estado de tu pedido.
                </p>
              </div>

            </div>
          </div>

        </form>
      </div>
    </main>
  );
}