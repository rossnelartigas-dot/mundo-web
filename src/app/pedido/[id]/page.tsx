import Link from "next/link";

import { getOrder } from "@/services/orderService";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderConfirmationPage({
  params,
}: Props) {
  const { id } = await params;

  const orderId = Number(id);

  if (Number.isNaN(orderId)) {
    return (
      <main className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-red-600">
              Pedido inválido
            </h1>

            <p className="mt-3 text-slate-500">
              No se pudo identificar el pedido.
            </p>

            <Link
              href="/"
              className="
                mt-6
                inline-flex
                rounded-lg
                bg-cyan-500
                px-5
                py-2.5
                font-medium
                text-white
                transition
                hover:bg-cyan-600
              "
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const order = await getOrder(orderId);

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">
              Pedido no encontrado
            </h1>

            <p className="mt-3 text-slate-500">
              No encontramos un pedido con el número #{orderId}.
            </p>

            <Link
              href="/"
              className="
                mt-6
                inline-flex
                rounded-lg
                bg-cyan-500
                px-5
                py-2.5
                font-medium
                text-white
                transition
                hover:bg-cyan-600
              "
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const products = Array.isArray(order.products)
    ? order.products
    : [];

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✓
            </div>

            <h1 className="mt-5 text-3xl font-bold text-slate-900">
              ¡Pedido recibido!
            </h1>

            <p className="mt-2 text-slate-600">
              Tu pedido fue registrado correctamente.
            </p>

            <p className="mt-4 text-lg font-semibold text-cyan-600">
              Pedido #{order.id}
            </p>

          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">

            <h2 className="text-xl font-bold text-slate-800">
              Estado del pedido
            </h2>

            <p className="mt-2 inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-700">
              {order.status}
            </p>

          </div>

          <div className="mt-8">

            <h2 className="text-xl font-bold text-slate-800">
              Datos del cliente
            </h2>

            <div className="mt-4 space-y-2 text-slate-600">

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

          <div className="mt-8">

            <h2 className="text-xl font-bold text-slate-800">
              Productos
            </h2>

            <div className="mt-4 space-y-4">

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
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      border-b
                      border-slate-200
                      pb-4
                    "
                  >

                    <div>

                      <p className="font-medium text-slate-800">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Cantidad: {product.quantity}
                      </p>

                    </div>

                    <p className="font-semibold text-slate-800">
                      $
                      {(
                        product.price *
                        product.quantity
                      ).toFixed(2)}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">

            <div className="flex items-center justify-between">

              <span className="text-xl font-bold text-slate-800">
                Total
              </span>

              <span className="text-3xl font-bold text-cyan-600">
                ${Number(order.total).toFixed(2)}
              </span>

            </div>

          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Link
              href="/"
              className="
                flex-1
                rounded-lg
                bg-cyan-500
                px-5
                py-3
                text-center
                font-medium
                text-white
                transition
                hover:bg-cyan-600
              "
            >
              Seguir comprando
            </Link>

            <Link
              href="/productos"
              className="
                flex-1
                rounded-lg
                border
                border-slate-300
                px-5
                py-3
                text-center
                font-medium
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >
              Ver productos
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}
