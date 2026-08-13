import Link from "next/link";
import { notFound } from "next/navigation";

import { getOrder } from "@/services/orderService";

import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import OrderProductsTable from "@/components/admin/OrderProductsTable";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const order = await getOrder(Number(id));

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-slate-100">

      {/* Encabezado y Navegación */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Pedido <span className="text-cyan-400 font-mono">#{order.id}</span>
          </h1>

          <p className="text-xs text-slate-400 font-mono mt-1">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 px-5 py-2.5 rounded-xl text-xs font-mono transition-all w-fit"
        >
          ← Volver a Pedidos
        </Link>

      </div>

      {/* Tarjetas Informativas */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Datos del Cliente */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">

          <h2 className="text-lg font-bold text-white font-mono tracking-wide border-b border-slate-800/80 pb-3">
            Datos del cliente
          </h2>

          <div className="space-y-2.5 text-sm">

            <p className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/40 pb-2">
              <span className="text-slate-400 font-mono text-xs uppercase">Nombre:</span>
              <span className="font-semibold text-slate-100">{order.customer_name || "Sin registro"}</span>
            </p>

            <p className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/40 pb-2">
              <span className="text-slate-400 font-mono text-xs uppercase">Teléfono:</span>
              <span className="font-mono text-cyan-400">{order.customer_phone || "Sin registro"}</span>
            </p>

            <p className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/40 pb-2">
              <span className="text-slate-400 font-mono text-xs uppercase">Correo:</span>
              <span className="font-mono text-slate-200">{order.customer_email || "Sin registro"}</span>
            </p>

            <p className="flex flex-col sm:flex-row sm:items-start justify-between pt-1">
              <span className="text-slate-400 font-mono text-xs uppercase">Dirección:</span>
              <span className="text-slate-200 sm:text-right max-w-xs">{order.customer_address || "Sin registro"}</span>
            </p>

          </div>

        </div>

        {/* Gestión del Estado del Pedido */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">

          <div>
            <h2 className="text-lg font-bold text-white font-mono tracking-wide border-b border-slate-800/80 pb-3 mb-4">
              Estado del pedido
            </h2>

            <OrderStatusSelect
              id={order.id}
              status={order.status}
            />
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6">
            <DeleteOrderButton
              id={order.id}
            />
          </div>

        </div>

      </div>

      {/* Listado de Productos */}
      <div className="space-y-4">

        <h2 className="text-xl font-bold text-white font-mono tracking-wide">
          Productos
        </h2>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl overflow-hidden p-1">
          <OrderProductsTable
            products={order.products}
          />
        </div>

      </div>

      {/* Total del Pedido */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl">

        <div className="flex justify-end">

          <div className="text-right">

            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Total del pedido
            </p>

            <h2 className="text-4xl font-extrabold font-mono text-emerald-400 mt-1">
              ${Number(order.total).toFixed(2)}
            </h2>

          </div>

        </div>

      </div>

    </div>
  );
}
