"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building, Smartphone, Wallet } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/orderService";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
  });

  const [userId, setUserId] = useState<string | null>(null);

  // Métodos y referencias de pago
  const [paymentMethod, setPaymentMethod] = useState("pago_movil");
  const [paymentReference, setPaymentReference] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar usuario autenticado si existe
  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
        if (session.user.email) {
          setForm((prev) => ({
            ...prev,
            customer_email: session.user.email!.toLowerCase().trim(),
          }));
        }
      }
    }

    checkUser();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const cleanEmail = form.customer_email.trim().toLowerCase();
    const cleanName = form.customer_name.trim();
    const cleanPhone = form.customer_phone.trim();
    const cleanAddress = form.customer_address.trim();
    const cleanRef = paymentReference.trim();

    if (!cleanName || !cleanPhone || !cleanEmail || !cleanAddress) {
      alert("Por favor completa todos los campos de información personal.");
      return;
    }

    if (!cleanRef) {
      alert("Por favor ingresa el número de referencia o Hash/ID de tu pago.");
      return;
    }

    setLoading(true);

    try {
      // Envío de la orden pasando user_id si está autenticado
      const order = await createOrder({
        user_id: userId,
        customer_name: cleanName,
        customer_phone: cleanPhone,
        customer_email: cleanEmail,
        customer_address: cleanAddress,
        payment_method: paymentMethod,
        payment_reference: cleanRef,
        products: cart,
        total: Number(total),
      });

      clearCart();

      // Redirección con parámetros normalizados
      router.push(
        `/pedido?id=${order.id}&email=${encodeURIComponent(cleanEmail)}`
      );
    } catch (error) {
      console.error("Error creando pedido:", error);
      alert("No se pudo crear el pedido. Por favor intenta nuevamente.");
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
              Agrega productos al carrito antes de continuar con la compra.
            </p>

            <button
              type="button"
              onClick={() => router.push("/productos")}
              className="mt-6 inline-flex rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600 cursor-pointer"
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
            Completa tus datos y selecciona tu método de pago para registrar el pedido.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* COLUMNA IZQUIERDA: DATOS + PAGO */}
          <div className="space-y-8 lg:col-span-2">
            {/* DATOS DEL CLIENTE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-slate-900">
                  1. Datos del cliente
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Utilizaremos estos datos para procesar y consultar tu pedido.
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
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
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN MÉTODOS DE PAGO */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  2. Método de pago
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Selecciona tu método de pago y registra la referencia de la operación.
                </p>
              </div>

              {/* Botones de Selección */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pago_movil")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === "pago_movil"
                      ? "bg-cyan-50 border-cyan-500 text-cyan-700 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Smartphone size={22} className="text-cyan-600" />
                  <span>Pago Móvil</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("transferencia")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === "transferencia"
                      ? "bg-cyan-50 border-cyan-500 text-cyan-700 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Building size={22} className="text-blue-600" />
                  <span>Transferencia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("binance")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === "binance"
                      ? "bg-cyan-50 border-cyan-500 text-cyan-700 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Wallet size={22} className="text-amber-500" />
                  <span>Binance Pay</span>
                </button>
              </div>

              {/* Detalles e Instrucciones */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-sm space-y-4">
                {paymentMethod === "pago_movil" && (
                  <div className="space-y-1">
                    <p className="text-cyan-800 font-bold mb-2">Datos para Pago Móvil:</p>
                    <p className="text-slate-600">Banco: <span className="text-slate-900 font-semibold">Banesco (0134)</span></p>
                    <p className="text-slate-600">Teléfono: <span className="text-slate-900 font-semibold">0412-0000000</span></p>
                    <p className="text-slate-600">RIF: <span className="text-slate-900 font-semibold">J-123456789</span></p>
                  </div>
                )}

                {paymentMethod === "transferencia" && (
                  <div className="space-y-1">
                    <p className="text-blue-800 font-bold mb-2">Datos Bancarios:</p>
                    <p className="text-slate-600">Banco: <span className="text-slate-900 font-semibold">Banesco</span></p>
                    <p className="text-slate-600">Cuenta Corriente: <span className="text-slate-900 font-semibold">0134-XXXX-XX-XXXXXXXXXX</span></p>
                    <p className="text-slate-600">Titular: <span className="text-slate-900 font-semibold">Mundo Web C.A.</span></p>
                    <p className="text-slate-600">RIF: <span className="text-slate-900 font-semibold">J-123456789</span></p>
                  </div>
                )}

                {paymentMethod === "binance" && (
                  <div className="space-y-1">
                    <p className="text-amber-800 font-bold mb-2">Datos para Binance Pay:</p>
                    <p className="text-slate-600">Binance ID (Pay ID): <span className="text-slate-900 font-semibold">123456789</span></p>
                    <p className="text-slate-600">Correo Binance: <span className="text-slate-900 font-semibold">pagos@mundoweb.com</span></p>
                  </div>
                )}

                {/* Campo obligatorio de referencia */}
                <div className="pt-3 border-t border-slate-200">
                  <label
                    htmlFor="payment_reference"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    {paymentMethod === "binance"
                      ? "Order ID / Reference Binance (Obligatorio):"
                      : "Número de Referencia (Obligatorio):"}
                  </label>
                  <input
                    id="payment_reference"
                    type="text"
                    required
                    placeholder={
                      paymentMethod === "binance"
                        ? "Ej: 21983019283"
                        : "Ej: 00123456"
                    }
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RESUMEN DE COMPRA (COLUMNA DERECHA) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                Resumen de compra
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {cart.length} {cart.length === 1 ? "producto" : "productos"}
              </p>

              {/* PRODUCTOS */}
              <div className="mt-6 space-y-5">
                {cart.map((product) => (
                  <div key={product.id} className="flex gap-4">
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
                        ${(Number(product.price) * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-slate-200" />

              {/* SUBTOTAL */}
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium">${Number(total).toFixed(2)}</span>
              </div>

              {/* ENVÍO */}
              <div className="mt-3 flex items-center justify-between text-slate-600">
                <span>Envío</span>
                <span className="font-medium">Por confirmar</span>
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

              {/* BOTÓN SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-cyan-500 px-5 py-4 text-base font-bold text-white shadow-sm transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Procesando pedido..." : "Confirmar pedido"}
              </button>

              <div className="mt-5 text-center">
                <p className="text-xs leading-5 text-slate-400">
                  Al confirmar tu pedido, tus datos y la referencia brindada se guardarán para validar tu pago.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}