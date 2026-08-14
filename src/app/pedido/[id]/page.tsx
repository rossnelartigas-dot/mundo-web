import Link from "next/link";
import { 
  AlertTriangle, 
  SearchX, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  ShoppingBag, 
  ArrowLeft,
  DollarSign
} from "lucide-react";

import { getOrderByIdAndEmail } from "@/services/orderService";
import OrderStatusTracker from "@/components/OrderStatusTracker";

interface Props {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    email?: string;
  }>;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { email } = await searchParams;

  const orderId = Number(id);

  // 1. ERROR: Parámetros inválidos
  if (Number.isNaN(orderId) || !email) {
    return (
      <main className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 flex items-center justify-center text-slate-100">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-red-500/30 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
            
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Consulta Inválida
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-400 font-mono">
              Debes proporcionar el número de pedido y el correo electrónico utilizado durante la compra.
            </p>

            <Link
              href="/consultar-pedido"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-semibold px-6 py-2.5 text-sm transition duration-200 border border-cyan-400/30 shadow-lg shadow-cyan-950/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a consultar
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const order = await getOrderByIdAndEmail(orderId, email);

  // 2. ERROR: Pedido no encontrado
  if (!order) {
    return (
      <main className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 flex items-center justify-center text-slate-100">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
              <SearchX className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Pedido No Encontrado
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-400 font-mono">
              El número de pedido y el correo electrónico no coinciden con ningún registro activo en el sistema.
            </p>

            <Link
              href="/consultar-pedido"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-semibold px-6 py-2.5 text-sm transition duration-200 border border-cyan-400/30 shadow-lg shadow-cyan-950/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Intentar nuevamente
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const products = Array.isArray(order.products) ? order.products : [];

  // 3. VISTA PRINCIPAL DEL PEDIDO
  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* CONTENEDOR PRINCIPAL */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          {/* Adorno Neón Superior */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500" />

          {/* ENCABEZADO */}
          <div className="text-center pb-6 border-b border-slate-800">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pedido Confirmado
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-400 font-mono">
              Información y seguimiento en tiempo real de tu solicitud.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-sm font-bold">
              <span>Pedido #{order.id}</span>
            </div>
          </div>

          {/* SEGUIMIENTO DE ESTADO */}
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
            <h2 className="text-base font-mono font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              Seguimiento del Pedido
            </h2>

            <OrderStatusTracker status={order.status} />
          </div>

          {/* DATOS DEL CLIENTE */}
          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <h2 className="text-base font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">
              Datos del Cliente
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-mono text-slate-300">
              
              <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                <User className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="truncate">
                  <span className="text-slate-500 block text-[10px] uppercase">Nombre</span>
                  <span className="font-semibold text-white">{order.customer_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="truncate">
                  <span className="text-slate-500 block text-[10px] uppercase">Teléfono</span>
                  <span className="font-semibold text-white">{order.customer_phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="truncate">
                  <span className="text-slate-500 block text-[10px] uppercase">Correo</span>
                  <span className="font-semibold text-white">{order.customer_email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="truncate">
                  <span className="text-slate-500 block text-[10px] uppercase">Dirección</span>
                  <span className="font-semibold text-white">{order.customer_address}</span>
                </div>
              </div>

            </div>
          </div>

          {/* PRODUCTOS */}
          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <h2 className="text-base font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">
              Resumen de Productos
            </h2>

            <div className="space-y-3">
              {products.map(
                (
                  product: {
                    id: number;
                    name: string;
                    price: number;
                    quantity: number;
                  },
                  index: number
                ) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition"
                  >
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 font-mono">
                        Cantidad: <span className="text-cyan-400 font-bold">{product.quantity}</span>
                      </p>
                    </div>

                    <p className="font-mono font-bold text-white text-sm sm:text-base">
                      ${(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* TOTAL */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-base font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-cyan-400" /> Total a Pagar
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* BOTONES DE NAVEGACIÓN */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-semibold py-3 px-5 transition duration-200 border border-cyan-400/30 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Seguir comprando
            </Link>

            <Link
              href="/productos"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-mono font-semibold py-3 px-5 transition duration-200 border border-slate-800 text-sm"
            >
              Ver catálogo completo
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}