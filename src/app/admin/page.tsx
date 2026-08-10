import DashboardCard from "@/components/admin/DashboardCard";
import { getOrders } from "@/services/orderService";
import { getProducts } from "@/services/productService";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  let orders = [];
  let products = [];

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
    (order: any) => order.status === "paid"
  );
  const totalPaidSales = paidOrders.reduce(
    (sum: number, order: any) => sum + Number(order.total ?? 0),
    0
  );
  const uniqueCustomers = new Set(
    orders.map(
      (order: any) =>
        order.customer_email || `${order.customer_name}-${order.customer_phone}`
    )
  ).size;
  const averageSale =
    paidOrders.length > 0
      ? totalPaidSales / paidOrders.length
      : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Productos" value={totalProducts} />

        <DashboardCard title="Pedidos" value={totalOrders} />

        <DashboardCard title="Clientes" value={uniqueCustomers} />

        <DashboardCard
          title="Ventas"
          value={`$${totalPaidSales.toFixed(2)}`}
        />
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Resumen de ventas pagadas
            </h2>
            <p className="text-slate-500 mt-2">
              Totales y últimos pedidos que ya están en estatus "Pagado".
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
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

        <div className="overflow-hidden rounded-xl shadow bg-white mt-6">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-semibold">
              Últimos pedidos pagados
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3">Pedido</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {paidOrders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-semibold">#{order.id}</td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3">${Number(order.total).toFixed(2)}</td>
                    <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {paidOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
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
