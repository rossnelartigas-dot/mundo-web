import Link from "next/link";

import { getOrders } from "@/services/orderService";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

function getStatusStyle(status: string) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";

    case "confirmed":
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";

    case "paid":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

    case "preparing":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";

    case "shipped":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

    case "delivered":
      return "bg-green-500/10 text-green-400 border-green-500/30";

    case "cancelled":
    case "cancelado":
      return "bg-red-500/10 text-red-400 border-red-500/30";

    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  }
}

function getStatusLabel(status: string) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Pendiente";

    case "confirmed":
      return "Confirmado";

    case "paid":
      return "Pagado";

    case "preparing":
      return "Preparando";

    case "shipped":
      return "Enviado";

    case "delivered":
      return "Entregado";

    case "cancelled":
    case "cancelado":
      return "Cancelado";

    default:
      return status || "Sin estado";
  }
}

export default async function OrdersPage() {
  let orders = [];

  try {
    orders = await getOrders();
  } catch (error) {
    console.error("Error loading orders:", error);
    orders = [];
  }

  return (
    <div className="space-y-8 text-slate-100">

      {/* ========================================================= */}
      {/* ENCABEZADO */}
      {/* ========================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Pedidos
          </h1>

          <p className="mt-1 text-xs text-slate-400 font-mono">
            Gestión e historial de órdenes registradas en la tienda.
          </p>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
            Total de pedidos
          </span>

          <p className="text-xl font-bold text-cyan-400 font-mono">
            {orders.length}
          </p>
        </div>

      </div>


      {/* ========================================================= */}
      {/* TABLA */}
      {/* ========================================================= */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm text-slate-300">

            <thead className="bg-slate-950/80 text-cyan-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">

              <tr>

                <th className="p-4 text-left">
                  #
                </th>

                <th className="p-4 text-left">
                  Cliente
                </th>

                <th className="p-4 text-center">
                  Teléfono
                </th>

                <th className="p-4 text-center">
                  Pago
                </th>

                <th className="p-4 text-center">
                  Total USD
                </th>

                <th className="p-4 text-center">
                  Total Bs.
                </th>

                <th className="p-4 text-center">
                  Estado
                </th>

                <th className="p-4 text-center">
                  Fecha
                </th>

                <th className="p-4 text-center">
                  Acción
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-800/60">

              {orders.map((order) => {

                const totalUsd = Number(order.total) || 0;
                const totalBs = Number(order.total_bs) || 0;

                const statusStyle = getStatusStyle(order.status);
                const statusLabel = getStatusLabel(order.status);

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >

                    {/* ID */}

                    <td className="p-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      #{order.id}
                    </td>


                    {/* CLIENTE */}

                    <td className="p-4">

                      <div className="font-semibold text-slate-100">
                        {order.customer_name || "Sin nombre"}
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {order.customer_email || "Sin correo"}
                      </div>

                    </td>


                    {/* TELÉFONO */}

                    <td className="p-4 text-center font-mono text-xs text-slate-400 whitespace-nowrap">
                      {order.customer_phone || "-"}
                    </td>


                    {/* MÉTODO DE PAGO */}

                    <td className="p-4 text-center">

                      <span className="inline-flex rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[10px] font-mono font-semibold text-slate-300 whitespace-nowrap">
                        {order.payment_method || "No especificado"}
                      </span>

                      {order.payment_reference && (
                        <div className="mt-1 text-[9px] text-slate-500 font-mono">
                          Ref: {order.payment_reference}
                        </div>
                      )}

                    </td>


                    {/* TOTAL USD */}

                    <td className="p-4 text-center font-mono font-bold text-cyan-400 whitespace-nowrap">
                      ${totalUsd.toFixed(2)}
                    </td>


                    {/* TOTAL BS */}

                    <td className="p-4 text-center font-mono font-bold text-emerald-400 whitespace-nowrap">

                      {totalBs > 0
                        ? `Bs. ${totalBs.toFixed(2)}`
                        : "-"}

                    </td>


                    {/* ESTADO */}

                    <td className="p-4 text-center">

                      <div className="flex flex-col items-center gap-2">

                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-mono font-bold ${statusStyle}`}
                        >
                          {statusLabel}
                        </span>

                        <OrderStatusSelect
                          id={order.id}
                          status={order.status}
                        />

                      </div>

                    </td>


                    {/* FECHA */}

                    <td className="p-4 text-center font-mono text-xs text-slate-400 whitespace-nowrap">

                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}

                    </td>


                    {/* ACCIÓN */}

                    <td className="p-4 text-center">

                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center justify-center bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      >
                        Ver
                      </Link>

                    </td>

                  </tr>
                );
              })}


              {/* SIN PEDIDOS */}

              {orders.length === 0 && (
                <tr>

                  <td
                    colSpan={9}
                    className="p-12 text-center"
                  >

                    <div className="text-slate-500 font-mono text-sm">
                      No hay pedidos registrados en el sistema.
                    </div>

                    <p className="mt-2 text-xs text-slate-600">
                      Los nuevos pedidos aparecerán automáticamente aquí.
                    </p>

                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}