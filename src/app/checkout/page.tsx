"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  Smartphone,
  Wallet,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Home,
  MessageCircle,
  Loader2,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/orderService";
import { supabase } from "@/lib/supabase";

interface CustomerForm {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<CustomerForm>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"pago_movil" | "transferencia" | "binance">("pago_movil");
  const [paymentReference, setPaymentReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [bcvRate, setBcvRate] = useState<number | null>(null);

  const numericTotal = Number(total) || 0;
  const whatsappNumber = "+584264433849";
  const whatsappMessage = encodeURIComponent(
    `Hola! Tengo una consulta antes de confirmar mi pedido en el Checkout. El total de mi carrito es $${numericTotal.toFixed(2)}.`
  );

 useEffect(() => {
    let isMounted = true;

    // Actualizamos el estado de manera asíncrona para no bloquear el cuerpo síncrono del efecto
    Promise.resolve().then(() => {
      if (isMounted) setMounted(true);
    });

    async function initializeCheckout() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          setUserId(session.user.id);
          if (session.user.email) {
            setForm((prev) => ({
              ...prev,
              customer_email: session.user.email?.toLowerCase().trim() || "",
            }));
          }
        }
      } catch (err) {
        console.error("Error obteniendo sesión de usuario:", err);
      }

      try {
        const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
        if (!res.ok) throw new Error("Error en respuesta de API DolarApi");
        const data = await res.json();
        if (data?.promedio && isMounted) {
          setBcvRate(Number(data.promedio));
        }
      } catch (err) {
        console.error("Error obteniendo tasa BCV:", err);
      }
    }

    initializeCheckout();

    return () => {
      isMounted = false;
    };
  }, []);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }, []);

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
      const order = await createOrder({
        user_id: userId,
        customer_name: cleanName,
        customer_phone: cleanPhone,
        customer_email: cleanEmail,
        customer_address: cleanAddress,
        payment_method: paymentMethod,
        payment_reference: cleanRef,
        products: cart,
        total: numericTotal,
      });

      // Notificación vía API Route /order-created
      try {
        await fetch("/api/order-created", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            customerEmail: cleanEmail,
            customerName: cleanName,
            customerPhone: cleanPhone,
            customerAddress: cleanAddress,
            paymentMethod,
            paymentReference: cleanRef,
            total: numericTotal,
            products: cart,
          }),
        });
      } catch (notifyErr) {
        console.error("Error enviando notificación de orden creada:", notifyErr);
      }

      clearCart();
      router.push(`/pedido?id=${order.id}&email=${encodeURIComponent(cleanEmail)}`);
    } catch (error) {
      console.error("Error creando pedido:", error);
      alert("No se pudo crear el pedido. Por favor intenta nuevamente.");
      setLoading(false);
    }
  }

  const totalBs = bcvRate ? (numericTotal * bcvRate).toFixed(2) : null;

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 py-16 text-slate-100 flex items-center">
        <div className="mx-auto max-w-2xl px-4 w-full">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-xl shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
              <ShoppingBag className="h-10 w-10" />
            </div>

            <h1 className="text-3xl font-bold text-white">Tu carrito está vacío</h1>

            <p className="mt-3 text-slate-400">
              Explora nuestro catálogo de tecnología y seguridad antes de proceder al pago.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white cursor-pointer"
              >
                <Home size={18} />
                Ir al inicio
              </button>
              <button
                type="button"
                onClick={() => router.push("/productos")}
                className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                Ver productos
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* NAVEGACIÓN SUPERIOR */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/carrito")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={18} className="text-cyan-400" />
              <span>Volver al carrito</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <Home size={18} className="text-cyan-400" />
              <span>Inicio</span>
            </button>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <MessageCircle size={18} className="text-emerald-400" />
            <span>¿Dudas? Hablar por WhatsApp</span>
          </a>
        </div>

        {/* TÍTULO */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Finalizar compra
          </h1>
          <p className="mt-2 text-slate-400">
            Completa tus datos y selecciona tu método de pago para procesar la orden.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* DATOS DEL CLIENTE */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <div className="mb-6 border-b border-slate-800/80 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 text-sm border border-cyan-500/20">1</span>
                  Datos del cliente
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ingresa tus datos para la entrega y confirmación del pedido.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="customer_name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Nombre completo
                  </label>
                  <input
                    id="customer_name"
                    name="customer_name"
                    type="text"
                    value={form.customer_name}
                    onChange={handleChange}
                    placeholder="Ej: John Doe"
                    disabled={loading}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="customer_phone" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="customer_email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="customer_address" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Dirección de entrega
                  </label>
                  <textarea
                    id="customer_address"
                    name="customer_address"
                    value={form.customer_address}
                    onChange={handleChange}
                    placeholder="Escribe la dirección exacta donde deseas recibir tu pedido..."
                    disabled={loading}
                    required
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN MÉTODOS DE PAGO */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <div className="mb-6 border-b border-slate-800/80 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 text-sm border border-cyan-500/20">2</span>
                  Método de pago
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Selecciona la opción de tu preferencia e ingresa el número de referencia.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <button
                  type="button"
                  aria-pressed={paymentMethod === "pago_movil"}
                  onClick={() => setPaymentMethod("pago_movil")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === "pago_movil"
                      ? "bg-cyan-950/40 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Smartphone size={22} className={paymentMethod === "pago_movil" ? "text-cyan-400" : "text-slate-500"} />
                  <span>Pago Móvil</span>
                </button>

                <button
                  type="button"
                  aria-pressed={paymentMethod === "transferencia"}
                  onClick={() => setPaymentMethod("transferencia")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === "transferencia"
                      ? "bg-cyan-950/40 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Building size={22} className={paymentMethod === "transferencia" ? "text-cyan-400" : "text-slate-500"} />
                  <span>Transferencia</span>
                </button>

                <button
                  type="button"
                  aria-pressed={paymentMethod === "binance"}
                  onClick={() => setPaymentMethod("binance")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === "binance"
                      ? "bg-cyan-950/40 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Wallet size={22} className={paymentMethod === "binance" ? "text-amber-400" : "text-slate-500"} />
                  <span>Binance Pay</span>
                </button>
              </div>

              {/* DETALLES DE PAGO */}
              <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-800/80 text-sm space-y-4">
                {paymentMethod === "pago_movil" && (
                  <div className="space-y-1.5 text-slate-300">
                    <p className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Datos para Pago Móvil:
                    </p>
                    <p>Banco: <span className="text-white font-medium">Mercantil (0105)</span></p>
                    <p>Teléfono: <span className="text-white font-medium">0414-5852935</span></p>
                    <p>RIF: <span className="text-white font-medium">V-29569063</span></p>
                    {totalBs && (
                      <p className="mt-2 text-xs font-semibold text-cyan-300 bg-cyan-950/50 p-2 rounded-lg border border-cyan-500/20">
                        Monto a transferir (Tasa BCV): Bs. {totalBs}
                      </p>
                    )}
                  </div>
                )}

                {paymentMethod === "transferencia" && (
                  <div className="space-y-1.5 text-slate-300">
                    <p className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Datos Bancarios:
                    </p>
                    <p>Banco: <span className="text-white font-medium">Mercantil</span></p>
                    <p>Cuenta Corriente: <span className="text-white font-medium">0105-XXXX-XX-XXXXXXXXXX</span></p>
                    <p>Titular: <span className="text-white font-medium">Tu Empresa / Nombre</span></p>
                    <p>RIF: <span className="text-white font-medium">V-29569063</span></p>
                  </div>
                )}

                {paymentMethod === "binance" && (
                  <div className="space-y-1.5 text-slate-300">
                    <p className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Datos para Binance Pay:
                    </p>
                    <p>Binance ID (Pay ID): <span className="text-white font-medium">XXXXXXXXX</span></p>
                    <p>Correo Binance: <span className="text-white font-medium">tu-correo@ejemplo.com</span></p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                  <label htmlFor="payment_reference" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    {paymentMethod === "binance" ? "Order ID / Reference Binance (Obligatorio)" : "Número de Referencia (Obligatorio)"}
                  </label>
                  <input
                    id="payment_reference"
                    type="text"
                    required
                    placeholder={paymentMethod === "binance" ? "Ej: 21983019283" : "Ej: 00123456"}
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm placeholder:text-slate-600 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RESUMEN DE COMPRA */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-xl font-bold text-white border-b border-slate-800/80 pb-3">
                Resumen de compra
              </h2>

              <p className="mt-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
                {cart.length} {cart.length === 1 ? "producto" : "productos"} en total
              </p>

              <div className="mt-5 space-y-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {cart.map((product) => (
                  <div key={product.id} className="flex gap-4 items-center border-b border-slate-800/40 pb-3 last:border-0">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl text-slate-600">
                          📦
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Cantidad: {product.quantity}
                      </p>
                      <p className="mt-1 text-sm font-bold text-cyan-400">
                        ${(Number(product.price) * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-slate-800" />

              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200">${numericTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Envío</span>
                  <span className="font-medium text-slate-400">Por confirmar</span>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-white">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-cyan-400">
                      ${numericTotal.toFixed(2)}
                    </span>
                    {totalBs && (
                      <p className="text-xs text-slate-400 mt-1">
                        ≈ Bs. {totalBs} (BCV)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-cyan-500 px-5 py-4 text-base font-bold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Procesando pedido...</span>
                  </>
                ) : (
                  "Confirmar pedido"
                )}
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-xs font-medium text-emerald-400 transition hover:bg-emerald-900/40"
              >
                <MessageCircle size={16} />
                <span>¿Prefieres acordar el pago por WhatsApp?</span>
              </a>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-cyan-500/70" />
                <span>Transacción cifrada y datos protegidos</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}