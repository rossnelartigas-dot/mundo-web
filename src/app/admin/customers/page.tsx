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
            new Date(b.lastPurchase || 0).getTime()
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
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Clientes
        </h1>

        <p className="mt-1 text-xs text-slate-400 font-mono">
          Analiza tus clientes y su historial de compras.
        </p>
      </div>

      {/* Tarjetas Neón Métricas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-xl">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Clientes
          </p>

          <p className="mt-2 text-3xl font-extrabold font-mono text-cyan-400">
            {totalCustomers}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-xl">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Pedidos
          </p>

          <p className="mt-2 text-3xl font-extrabold font-mono text-cyan-400">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-xl">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Ventas
          </p>

          <p className="mt-2 text-3xl font-extrabold font-mono text-cyan-400">
            ${totalSales.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-xl">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Promedio por cliente
          </p>

          <p className="mt-2 text-3xl font-extrabold font-mono text-cyan-400">
            ${averageCustomerPurchase.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Bloque Principal de la Tabla */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-mono tracking-wide">
              Lista de clientes
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Clientes agrupados por correo electrónico.
            </p>
          </div>

          {/* Buscador y Filtro estilizados */}
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 md:w-64 transition-all"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
            >
              <option value="totalSpent" className="bg-slate-900 text-slate-100">
                Mayor gasto
              </option>

              <option value="orders" className="bg-slate-900 text-slate-100">
                Más pedidos
              </option>

              <option value="lastPurchase" className="bg-slate-900 text-slate-100">
                Compra más reciente
              </option>

              <option value="averageOrder" className="bg-slate-900 text-slate-100">
                Mayor promedio
              </option>

              <option value="name" className="bg-slate-900 text-slate-100">
                Nombre
              </option>
            </select>
          </div>
        </div>

        {/* Tabla Cibernética de Clientes */}
        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-cyan-400 animate-pulse">
              [ Cargando información de clientes... ]
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-cyan-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">
                    Cliente
                  </th>

                  <th className="px-4 py-3.5">
                    Contacto
                  </th>

                  <th className="px-4 py-3.5 text-center">
                    Pedidos
                  </th>

                  <th className="px-4 py-3.5">
                    Total comprado
                  </th>

                  <th className="px-4 py-3.5">
                    Promedio
                  </th>

                  <th className="px-4 py-3.5">
                    Última compra
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={`${customer.email}-${customer.phone}`}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-100">
                        {customer.name}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-slate-300 font-mono text-xs">
                        {customer.email}
                      </div>

                      <div className="mt-1 text-xs text-slate-500 font-mono">
                        {customer.phone}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center font-mono font-bold text-cyan-400">
                      {customer.orders}
                    </td>

                    <td className="px-4 py-4 font-mono font-semibold text-emerald-400">
                      ${customer.totalSpent.toFixed(2)}
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-300">
                      ${customer.averageOrder.toFixed(2)}
                    </td>

                    <td className="px-4 py-4 font-mono text-xs text-slate-400">
                      {formatDate(customer.lastPurchase)}
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center font-mono text-xs text-slate-500"
                    >
                      {search
                        ? "No se encontraron clientes para la búsqueda."
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