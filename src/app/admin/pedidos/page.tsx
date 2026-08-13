"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Hash,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  payment_method: "pago_movil" | "transferencia" | "binance" | string;
  payment_reference: string;
  products: ProductItem[];
  total: number;
  status: "pendiente" | "verificado" | "rechazado" | "entregado" | string;
}

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [paymentFilter, setPaymentFilter] = useState("todos");

  // Estado para modal de detalle
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(
    orderId: string,
    newStatus: "verificado" | "rechazado" | "entregado"
  ) {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      // Actualizar estado localmente
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, status: newStatus } : ord
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      alert("Error al actualizar el estado del pedido.");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  // Filtrado de pedidos
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.payment_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || order.status === statusFilter;

    const matchesPayment =
      paymentFilter === "todos" || order.payment_method === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Métricas rápidas
  const totalIncome = orders
    .filter((o) => o.status === "verificado" || o.status === "entregado")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const pendingCount = orders.filter((o) => o.status === "pendiente").length;
  const verifiedCount = orders.filter((o) => o.status === "verificado").length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* HEADER DE LA PÁGINA */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Panel de Pedidos y Pagos
            </h1>
            <p className="text-sm text-slate-500">
              Verifica transacciones de Pago Móvil, Transferencias y Binance Pay.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-cyan-600" : "text-slate-500"} />
            <span>Actualizar lista</span>
          </button>
        </div>

        {/* MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Pedidos
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{orders.length}</span>
              <ShoppingBag className="text-slate-400" size={24} />
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Pagos Por Verificar
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-amber-900">{pendingCount}</span>
              <Clock className="text-amber-500" size={24} />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Pagos Aprobados
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-900">{verifiedCount}</span>
              <CheckCircle2 className="text-emerald-500" size={24} />
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Ingresos Verificados
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-cyan-900">${totalIncome.toFixed(2)}</span>
              <span className="text-xs font-bold px-2 py-1 bg-cyan-200/60 text-cyan-800 rounded-lg">USD</span>
            </div>
          </div>
        </div>

        {/* BARRA DE FILTROS Y BÚSQUEDA */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, email o nº de referencia..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          {/* Filtros Dropdown */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            {/* Estado */}
            <div className="relative min-w-[140px] flex-1 sm:flex-initial">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white pr-8 cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="verificado">Verificados</option>
                <option value="entregado">Entregados</option>
                <option value="rechazado">Rechazados</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Método de pago */}
            <div className="relative min-w-[150px] flex-1 sm:flex-initial">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-500 focus:bg-white pr-8 cursor-pointer"
              >
                <option value="todos">Todos los métodos</option>
                <option value="pago_movil">Pago Móvil</option>
                <option value="transferencia">Transferencia</option>
                <option value="binance">Binance Pay</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* TABLA DE PEDIDOS */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <RefreshCw size={28} className="mx-auto animate-spin text-cyan-500 mb-3" />
              <p className="font-medium text-sm">Cargando la lista de pedidos...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <ShoppingBag size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No se encontraron pedidos</p>
              <p className="text-xs text-slate-400 mt-1">Prueba cambiando los términos de búsqueda o filtros.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Fecha / ID</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Método</th>
                    <th className="px-6 py-4">Nº Referencia</th>
                    <th className="px-6 py-4">Monto</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const isUpdating = updatingId === order.id;

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Fecha e ID */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-medium text-slate-900">
                            {new Date(order.created_at).toLocaleDateString("es-VE", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs font-mono text-slate-400 truncate max-w-[100px]">
                            #{order.id.slice(0, 8)}
                          </p>
                        </td>

                        {/* Cliente */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-slate-900">{order.customer_name}</p>
                          <p className="text-xs text-slate-500">{order.customer_phone}</p>
                        </td>

                        {/* Método de pago */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 capitalize">
                            <CreditCard size={13} className="text-slate-500" />
                            {order.payment_method.replace("_", " ")}
                          </span>
                        </td>

                        {/* Nº Referencia */}
                        <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-cyan-700">
                          <span className="bg-cyan-50 border border-cyan-200/60 px-2 py-1 rounded-md">
                            {order.payment_reference || "N/A"}
                          </span>
                        </td>

                        {/* Monto */}
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                          ${Number(order.total).toFixed(2)}
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              title="Ver detalles"
                              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                            >
                              <Eye size={18} />
                            </button>

                            {order.status === "pendiente" && (
                              <>
                                <button
                                  disabled={isUpdating}
                                  onClick={() => updateOrderStatus(order.id, "verificado")}
                                  title="Aprobar Pago"
                                  className="rounded-lg bg-emerald-500 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition disabled:opacity-50"
                                >
                                  Aprobar
                                </button>
                                <button
                                  disabled={isUpdating}
                                  onClick={() => updateOrderStatus(order.id, "rechazado")}
                                  title="Rechazar Pago"
                                  className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition disabled:opacity-50"
                                >
                                  Rechazar
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DETALLE DEL PEDIDO */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
          isUpdating={updatingId === selectedOrder.id}
        />
      )}
    </main>
  );
}

{/* COMPONENTE: BADGE DE ESTADO */}
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "verificado":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={13} /> Verificado
        </span>
      );
    case "entregado":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
          <CheckCircle2 size={13} /> Entregado
        </span>
      );
    case "rechazado":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
          <XCircle size={13} /> Rechazado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
          <Clock size={13} /> Pendiente
        </span>
      );
  }
}

{/* COMPONENTE: MODAL DE DETALLE */}
function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  isUpdating,
}: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (id: string, status: "verificado" | "rechazado" | "entregado") => void;
  isUpdating: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Pedido #{order.id.slice(0, 8)}
              </h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Registrado el {new Date(order.created_at).toLocaleString("es-VE")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Info del Pago */}
        <div className="rounded-2xl bg-cyan-50/60 border border-cyan-100 p-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-2">
            <CreditCard size={15} /> Información del Pago
          </h3>
          <div className="grid grid-cols-2 gap-4 pt-1 text-sm">
            <div>
              <p className="text-xs text-slate-500">Método de Pago:</p>
              <p className="font-semibold text-slate-900 capitalize">
                {order.payment_method.replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Número de Referencia:</p>
              <p className="font-mono font-bold text-cyan-700 text-base">
                {order.payment_reference || "Sin referencia"}
              </p>
            </div>
          </div>
        </div>

        {/* Info del Cliente */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Datos del Cliente
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone size={15} className="text-slate-400" />
              <span>{order.customer_phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail size={15} className="text-slate-400" />
              <span className="truncate">{order.customer_email}</span>
            </div>
            <div className="sm:col-span-2 flex items-start gap-2 text-slate-700">
              <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
              <span>{order.customer_address}</span>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Productos Comprados
          </h3>
          <div className="divide-y divide-slate-100 border rounded-xl border-slate-200 overflow-hidden">
            {order.products?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 relative rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 text-xs">📦</div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      Cant: {item.quantity} x ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="font-bold text-slate-900 text-lg">Total del Pedido:</span>
          <span className="text-2xl font-extrabold text-cyan-600">
            ${Number(order.total).toFixed(2)}
          </span>
        </div>

        {/* Botones de Acción en Modal */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          {order.status === "pendiente" && (
            <>
              <button
                disabled={isUpdating}
                onClick={() => onUpdateStatus(order.id, "verificado")}
                className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-600 transition disabled:opacity-50"
              >
                Aprobar Pago
              </button>
              <button
                disabled={isUpdating}
                onClick={() => onUpdateStatus(order.id, "rechazado")}
                className="flex-1 rounded-xl bg-rose-50 py-3 text-sm font-bold text-rose-600 hover:bg-rose-100 transition disabled:opacity-50"
              >
                Rechazar
              </button>
            </>
          )}

          {order.status === "verificado" && (
            <button
              disabled={isUpdating}
              onClick={() => onUpdateStatus(order.id, "entregado")}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              Marcar como Entregado
            </button>
          )}
        </div>

      </div>
    </div>
  );
}