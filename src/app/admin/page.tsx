import DashboardCard from "@/components/admin/DashboardCard";
import { getOrders } from "@/services/orderService";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  let orders = [];

  try {
    orders = await getOrders();
  } catch (error) {
    console.error("Error loading dashboard orders:", error);
    orders = [];
  }

  const totalOrders = orders.length;
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Productos" value={0} />

        <DashboardCard title="Pedidos" value={totalOrders} />

        <DashboardCard title="Clientes" value={uniqueCustomers} />

        <DashboardCard
          title="Ventas"
          value={`$${totalPaidSales.toFixed(2)}`}
        />
      </div>
    </div>
  );
}
