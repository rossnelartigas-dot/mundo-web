import { getOrders } from "@/services/orderService";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  let orders = [];

  try {
    orders = await getOrders();
  } catch (error) {
    console.error("Error loading customer data:", error);
    orders = [];
  }

  const customersMap = new Map<string, {
    name: string;
    phone: string;
    email: string;
    address: string;
    orders: number;
    totalSpent: number;
    lastOrderAt: string;
  }>();

  orders.forEach((order: any) => {
    const key = order.customer_email || `${order.customer_name}-${order.customer_phone}`;
    const existing = customersMap.get(key);
    const orderDate = order.created_at ? new Date(order.created_at).toISOString() : "";

    if (existing) {
      customersMap.set(key, {
        ...existing,
        orders: existing.orders + 1,
        totalSpent: existing.totalSpent + Number(order.total ?? 0),
        lastOrderAt: existing.lastOrderAt > orderDate ? existing.lastOrderAt : orderDate,
      });
    } else {
      customersMap.set(key, {
        name: order.customer_name || "Sin nombre",
        phone: order.customer_phone || "Sin teléfono",
        email: order.customer_email || "Sin email",
        address: order.customer_address || "Sin dirección",
        orders: 1,
        totalSpent: Number(order.total ?? 0),
        lastOrderAt: orderDate,
      });
    }
  });

  const customers = Array.from(customersMap.values()).sort(
    (a, b) => (b.lastOrderAt || "").localeCompare(a.lastOrderAt || "")
  );
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="mt-2 text-slate-500">
          Resumen funcional de clientes creado a partir de los pedidos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-500">Clientes únicos</p>
          <h2 className="text-4xl font-bold mt-3">{totalCustomers}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-500">Ingresos totales</p>
          <h2 className="text-4xl font-bold mt-3">${totalRevenue.toFixed(2)}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-500">Promedio por cliente</p>
          <h2 className="text-4xl font-bold mt-3">
            ${totalCustomers > 0 ? (totalRevenue / totalCustomers).toFixed(2) : "0.00"}
          </h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl shadow bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold">Últimos clientes por actividad</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Pedidos</th>
                <th className="px-4 py-3">Gastado</th>
                <th className="px-4 py-3">Último pedido</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.email + customer.phone} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-semibold">{customer.name}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.orders}</td>
                  <td className="px-4 py-3">${customer.totalSpent.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {customer.lastOrderAt
                      ? new Date(customer.lastOrderAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    No se encontraron clientes.
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
