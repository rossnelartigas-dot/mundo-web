'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id?: string;
  product_name?: string;
  name?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number?: string;
  status?: string;
  total_amount?: number;
  total?: number;
  created_at: string;
  customer_email?: string;
  email?: string;
  items?: OrderItem[];
}

export default function PedidoPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Estados para búsqueda manual / invitado
  const [searchEmail, setSearchEmail] = useState('');
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // 1. Obtener sesión y cargar pedidos por el EMAIL del usuario
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      const currentEmail = session?.user?.email;

      if (currentEmail) {
        setUserEmail(currentEmail);

        // Trae todos los pedidos donde coincida el correo (customer_email o email)
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .or(`customer_email.eq.${currentEmail},email.eq.${currentEmail}`)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data);
        }
      }

      setLoading(false);
    }

    fetchOrders();
  }, []);

  // 2. Búsqueda manual para usuarios sin sesión / invitados
  const handleGuestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSearching(true);

    const emailToSearch = searchEmail.trim();
    const orderNumToSearch = searchOrderNumber.trim();

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`customer_email.eq.${emailToSearch},email.eq.${emailToSearch}`)
      .or(`order_number.eq.${orderNumToSearch},id.eq.${orderNumToSearch}`);

    setSearching(false);

    if (error || !data || data.length === 0) {
      setSearchError('No se encontró ningún pedido con los datos ingresados.');
      setOrders([]);
    } else {
      setOrders(data);
      if (data.length > 0) setExpandedOrderId(data[0].id);
    }
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || 'Procesando').toLowerCase();
    if (s.includes('completado') || s.includes('entregado')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (s.includes('pendiente') || s.includes('espera')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    if (s.includes('cancelado')) {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
    return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center space-x-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando información...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Encabezado */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {userEmail ? 'Mis Pedidos' : 'Consulta de Pedidos'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {userEmail
            ? `Mostrando pedidos asociados a ${userEmail}`
            : 'Ingresa los datos de tu compra para consultar el estado actual.'}
        </p>
      </div>

      {/* Formulario de búsqueda manual (Solo si no está logueado) */}
      {!userEmail && (
        <form onSubmit={handleGuestSearch} className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-base font-semibold text-slate-200">Consultar pedido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Correo Electrónico</label>
              <input
                type="email"
                required
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Número / ID de Pedido</label>
              <input
                type="text"
                required
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
                placeholder="Ej: 12345"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={searching}
            className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm disabled:opacity-50 transition shadow-lg shadow-cyan-500/10"
          >
            {searching ? 'Buscando...' : 'Buscar Pedido'}
          </button>

          {searchError && <p className="text-rose-400 text-xs mt-2">{searchError}</p>}
        </form>
      )}

      {/* Listado de Pedidos Desplegables */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800/60 p-6">
            <p className="text-slate-400 text-sm font-medium">
              {userEmail
                ? 'Aún no tienes pedidos registrados con este correo.'
                : 'Utiliza el formulario superior para consultar un pedido.'}
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const orderNum = order.order_number || order.id.substring(0, 8);
            const total = order.total_amount ?? order.total ?? 0;
            const email = order.customer_email || order.email || 'N/A';

            return (
              <div
                key={order.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition shadow-lg"
              >
                {/* Cabecera para desplegar */}
                <button
                  onClick={() => toggleOrder(order.id)}
                  className="w-full p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-white text-base">Pedido #{orderNum}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${getStatusBadge(order.status)}`}>
                        {order.status || 'Procesando'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Fecha: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                    <div className="text-left md:text-right">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Total</span>
                      <span className="font-extrabold text-cyan-400 text-lg">${total.toLocaleString()}</span>
                    </div>

                    <div className={`p-2 rounded-xl bg-slate-800/50 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-slate-800 text-white' : ''}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Detalle desplegable */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 bg-slate-950/50 p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Correo del cliente:</span>
                        <span className="font-medium text-white">{email}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">ID del pedido:</span>
                        <span className="font-mono text-slate-400">{order.id}</span>
                      </div>
                    </div>

                    {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Productos</h4>
                        <div className="divide-y divide-slate-800/60 border border-slate-800/60 rounded-xl overflow-hidden bg-slate-900/30">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="p-3 flex justify-between items-center text-sm">
                              <div>
                                <p className="font-medium text-white">{item.product_name || item.name || 'Producto'}</p>
                                <p className="text-xs text-slate-500">Cantidad: {item.quantity}</p>
                              </div>
                              <span className="font-semibold text-slate-200">${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
