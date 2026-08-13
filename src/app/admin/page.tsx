import DashboardCard from "@/components/admin/DashboardCard";
import { getOrders } from "@/services/orderService";
import { getProducts } from "@/services/productService";

export const dynamic = "force-dynamic";

interface OrderRecord {
  id?: string | number;
  status?: string;
  total?: number | string;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  created_at?: string;
}

interface ProductRecord {
  id?: string | number;
}

export default async function Dashboard() {
  let orders: OrderRecord[] = [];
  let products: ProductRecord[] = [];

  try {
    orders = await getOrders();
  } catch (error) {
    console.error("Error loading dashboard orders:", error);
    orders = [];
  }

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Error loading dashboard products:", error);
    products = [];
  }

  const totalOrders = orders.length;
  const totalProducts = products.length;

  const paidOrders = orders.filter(
    (order) => order.status === "paid"
  );

  const totalPaidSales = paidOrders.reduce(
    (sum: number, order) =>
      sum + Number(order.total ?? 0),
    0
  );

  const uniqueCustomers = new Set(
    orders.map(
      (order) =>
        order.customer_email ||
        `${order.customer_name}-${order.customer_phone}`
    )
  ).size;

  const averageSale =
    paidOrders.length > 0
      ? totalPaidSales / paidOrders.length
      : 0;

  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Resumen operativo en tiempo real.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Productos"
          value={totalProducts}
        />

        <DashboardCard
          title="Pedidos"
          value={totalOrders}
        />

        <DashboardCard
          title="Clientes"
          value={uniqueCustomers}
        />

        <DashboardCard
          title="Ventas"
          value={`$${totalPaidSales.toFixed(2)}`}
        />
      </div>

      <section className="mt-10 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Resumen de ventas pagadas
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Totales y últimos pedidos que ya están en estado
              &quot;Pagado&quot;.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <DashboardCard
            title="Pedidos pagados"
            value={paidOrders.length}
          />

          <DashboardCard
            title="Total pagado"
            value={`$${totalPaidSales.toFixed(2)}`}
          />

          <DashboardCard
            title="Ticket promedio"
            value={`$${averageSale.toFixed(2)}`}
          />
        </div>

        {/* Tabla cibernética de pedidos */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl">
          <div className="border-b border-slate-800 px-6 py-4 bg-slate-950/40">
            <h3 className="text-base font-bold text-white font-mono tracking-wide">
              Últimos pedidos pagados
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-cyan-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Pedido</th>
                  <th className="px-6 py-3.5">Cliente</th>
                  <th className="px-6 py-3.5">Total</th>
                  <th className="px-6 py-3.5">Fecha</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {paidOrders.slice(0, 5).map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">
                      #{order.id}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-200">
                      {order.customer_name || "Cliente general"}
                    </td>

                    <td className="px-6 py-4 font-mono font-semibold text-emerald-400">
                      ${Number(order.total).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {new Date(
                        order.created_at ?? ""
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {paidOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-slate-500 font-mono text-xs"
                    >
                      No hay pedidos pagados todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}