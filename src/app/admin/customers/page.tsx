"use client";

import { useEffect, useMemo, useState } from "react";
import { getOrders } from "@/services/orderService";

interface OrderRecord {
  id: number;
  status?: string;
  total?: number | string;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  created_at?: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  averageOrder: number;
  lastPurchase: string;
}

export default function CustomersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data ?? []);
      } catch (error) {
        console.error("Error loading customers:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const customers = useMemo<Customer[]>(() => {
    const customerMap = new Map<string, Customer>();

    orders.forEach((order) => {
      const email = order.customer_email?.trim().toLowerCase();

      const fallbackKey = `${order.customer_name ?? ""}-${order.customer_phone ?? ""}`
        .trim()
        .toLowerCase();

      const key = email || fallbackKey;

      if (!key) {
        return;
      }

      const existingCustomer = customerMap.get(key);

      if (!existingCustomer) {
        customerMap.set(key, {
          name: order.customer_name || "Sin nombre",
          email: order.customer_email || "Sin correo",
          phone: order.customer_phone || "Sin teléfono",
          orders: 1,
          totalSpent:
            order.status === "cancelled"
              ? 0
              : Number(order.total ?? 0),
          averageOrder:
            order.status === "cancelled"
              ? 0
              : Number(order.total ?? 0),
          lastPurchase: order.created_at || "",
        });

        return;
      }

      existingCustomer.orders += 1;

      if (order.status !== "cancelled") {
        existingCustomer.totalSpent += Number(order.total ?? 0);
      }

      if (
        order.created_at &&
        (!existingCustomer.lastPurchase ||
          new Date(order.created_at) >
            new Date(existingCustomer.lastPurchase))
      ) {
        existingCustomer.lastPurchase = order.created_at;
      }

      existingCustomer.averageOrder =
        existingCustomer.orders > 0
          ? existingCustomer.totalSpent / existingCustomer.orders
          : 0;
    });

    return Array.from(customerMap.values());
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = customers.filter((customer) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.email.toLowerCase().includes(normalizedSearch) ||
        customer.phone.toLowerCase().includes(normalizedSearch)
      );
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);

        case "orders":
          return b.orders - a.orders;

        case "lastPurchase":
          return (
            new Date(b.lastPurchase || 0).getTime() -
            new Date(a.lastPurchase || 0).getTime()
          );

        case "averageOrder":
          return b.averageOrder - a.averageOrder;

        case "totalSpent":
        default:
          return b.totalSpent - a.totalSpent;
      }
    });
  }, [customers, search, sortBy]);

  const totalCustomers = customers.length;

  const totalOrders = orders.length;

  const totalSales = orders.reduce((sum, order) => {
    if (order.status === "cancelled") {
      return sum;
    }

    return sum + Number(order.total ?? 0);
  }, 0);

  const averageCustomerPurchase =
    totalCustomers > 0
      ? totalSales / totalCustomers
      : 0;

  function formatDate(date: string) {
    if (!date) {
      return "Sin datos";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Sin datos";
    }

    return parsedDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Clientes
        </h1>

        <p className="mt-2 text-slate-500">
          Analiza tus clientes y su historial de compras.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm font-medium text-slate-500">
            Clientes
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalCustomers}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm font-medium text-slate-500">
            Pedidos
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm font-medium text-slate-500">
            Ventas
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            ${totalSales.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm font-medium text-slate-500">
            Promedio por cliente
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            ${averageCustomerPurchase.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Lista de clientes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Clientes agrupados por correo electrónico.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-cyan-500 md:w-64"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-cyan-500"
            >
              <option value="totalSpent">
                Mayor gasto
              </option>

              <option value="orders">
                Más pedidos
              </option>

              <option value="lastPurchase">
                Compra más reciente
              </option>

              <option value="averageOrder">
                Mayor promedio
              </option>

              <option value="name">
                Nombre
              </option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <div className="py-10 text-center text-slate-500">
              Cargando clientes...
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3">
                    Cliente
                  </th>

                  <th className="px-4 py-3">
                    Contacto
                  </th>

                  <th className="px-4 py-3 text-center">
                    Pedidos
                  </th>

                  <th className="px-4 py-3">
                    Total comprado
                  </th>

                  <th className="px-4 py-3">
                    Promedio
                  </th>

                  <th className="px-4 py-3">
                    Última compra
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={`${customer.email}-${customer.phone}`}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">
                        {customer.name}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-slate-700">
                        {customer.email}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {customer.phone}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center font-semibold">
                      {customer.orders}
                    </td>

                    <td className="px-4 py-4 font-semibold text-emerald-600">
                      ${customer.totalSpent.toFixed(2)}
                    </td>

                    <td className="px-4 py-4">
                      ${customer.averageOrder.toFixed(2)}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(customer.lastPurchase)}
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      {search
                        ? "No se encontraron clientes."
                        : "Todavía no hay clientes registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
