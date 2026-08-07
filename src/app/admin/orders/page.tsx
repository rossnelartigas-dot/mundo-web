import Link from "next/link";

import { getOrders } from "@/services/orderService";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Pedidos
        </h1>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-200">

            <tr>

              <th className="p-4 text-left">
                #
              </th>

              <th className="p-4 text-left">
                Cliente
              </th>

              <th className="p-4">
                Teléfono
              </th>

              <th className="p-4">
                Total
              </th>

              <th className="p-4">
                Estado
              </th>

              <th className="p-4">
                Fecha
              </th>

              <th className="p-4">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-4 font-bold">
                  #{order.id}
                </td>

                <td className="p-4">
                  {order.customer_name}
                </td>

                <td className="text-center">
                  {order.customer_phone}
                </td>

                <td className="text-center font-semibold">
                  ${Number(order.total).toFixed(2)}
                </td>

                <td className="text-center">

                  <OrderStatusSelect
                    id={order.id}
                    status={order.status}
                  />

                </td>

                <td className="text-center">

                  {new Date(
                    order.created_at
                  ).toLocaleDateString()}

                </td>

                <td className="text-center">

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
                  >
                    Ver
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}