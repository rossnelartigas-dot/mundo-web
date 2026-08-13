import Link from "next/link";

import { getOrders } from "@/services/orderService";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

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

      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Pedidos
        </h1>
        <p className="mt-1 text-xs text-slate-400 font-mono">
          Gestión e historial de órdenes registradas en la tienda.
        </p>
      </div>

      {/* Contenedor vidriado con tabla cibernética */}
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
                  Total
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

              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-cyan-400">
                    #{order.id}
                  </td>
                  <td className="p-4 font-medium text-slate-100">
                    {order.customer_name || "Sin nombre"}
                  </td>
                  <td className="p-4 text-center font-mono text-xs text-slate-400">
                    {order.customer_phone || "-"}
                  </td>
                  <td className="p-4 text-center font-mono font-semibold text-emerald-400">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">

                    <OrderStatusSelect
                      id={order.id}
                      status={order.status}
                    />

                  </td>
                  <td className="p-4 text-center font-mono text-xs text-slate-400">

                    {new Date(
                      order.created_at
                    ).toLocaleDateString()}

                  </td>
                  <td className="p-4 text-center">

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-block bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    >
                      Ver
                    </Link>

                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center font-mono text-xs text-slate-500"
                  >
                    No hay pedidos registrados en el sistema.
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