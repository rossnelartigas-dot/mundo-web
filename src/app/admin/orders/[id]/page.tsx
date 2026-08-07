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
    <div className="max-w-7xl mx-auto p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Pedido #{order.id}
          </h1>

          <p className="text-slate-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="bg-slate-700 text-white px-5 py-3 rounded-lg"
        >
          ← Volver
        </Link>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Datos del cliente
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Nombre:</strong>{" "}
              {order.customer_name}
            </p>

            <p>
              <strong>Teléfono:</strong>{" "}
              {order.customer_phone}
            </p>

            <p>
              <strong>Correo:</strong>{" "}
              {order.customer_email}
            </p>

            <p>
              <strong>Dirección:</strong>{" "}
              {order.customer_address}
            </p>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Estado del pedido
          </h2>

          <OrderStatusSelect
            id={order.id}
            status={order.status}
          />

          <div className="mt-8">
            <DeleteOrderButton
              id={order.id}
            />
          </div>

        </div>

      </div>

      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Productos
        </h2>

        <OrderProductsTable
          products={order.products}
        />

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex justify-end">

          <div className="text-right">

            <p className="text-slate-500">
              Total del pedido
            </p>

            <h2 className="text-4xl font-bold text-cyan-600">
              ${Number(order.total).toFixed(2)}
            </h2>

          </div>

        </div>

      </div>

    </div>
  );
}