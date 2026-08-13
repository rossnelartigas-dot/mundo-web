'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ProductItem {
  id?: number | string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
}

interface Order {
  id: string | number;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  status?: string;
  total?: number;
  created_at: string;
  user_id?: string | null;
  products?: ProductItem[] | string; // Puede venir como array o como string JSON
}

export default function PedidoPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | number | null>(null);

  // Estados para búsqueda de invitados
  const [searchEmail, setSearchEmail] = useState('');
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // 1. Cargar pedidos al montar el componente
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const email = session.user.email;
        const uid = session.user.id;
        
        setUserEmail(email || null);
        setUserId(uid);

        // Busca por user_id O por customer_email para traer tanto viejos como nuevos
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .or(`user_id.eq.${uid},customer_email.eq.${email}`)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data);
        }
      }

      setLoading(false);
    }

    fetchOrders();
  }, []);

  // 2. Búsqueda manual como invitado
  const handleGuestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSearching(true);

    const emailQuery = searchEmail.trim();
    const orderNumQuery = searchOrderNumber.trim();

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', emailQuery)
      .eq('id', orderNumQuery);

    setSearching(false);

    if (error || !data || data.length === 0) {
      setSearchError('No se encontró ningún pedido con esos datos.');
      setOrders([]);
    } else {
      setOrders(data);
      if (data.length > 0) setExpandedOrderId(data[0].id);
    }
  };

  // Alternar acordeón desplegable
  const toggleOrder = (id: string | number) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  // Parsear productos en formato JSON si vienen como String
  const parseProducts = (productsRaw: ProductItem[] | string | undefined): ProductItem[] => {
    if (!productsRaw) return [];
    if (Array.isArray(productsRaw)) return productsRaw;
    try {
      return JSON.parse(productsRaw);
    } catch {
      return [];
    }
  };

  // Badge de estado dinámico
  const getStatusBadge = (status?: string) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'paid' || s === 'completado' || s === 'delivered') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (s === 'pending' || s === 'pendiente') {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    if (s === 'cancelled' || s === 'cancelado') {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
    return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center space-x-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando tus pedidos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Encabezado */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {userEmail ? 'Mis Pedidos' : 'Consulta de Pedidos'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {userEmail
            ? `Mostrando historial de compras de ${userEmail}`
            : 'Ingresa los datos de tu compra para consultar el estado actual.'}
        </p>
      </div>

      {/* Formulario Invitados */}
      {!userId && (
        <form onSubmit={handleGuestSearch} className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-base font-semibold text-slate-200">Consultar como invitado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Correo Electrónico</label>
              <input
                type="email"
                required
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">ID / Número de Pedido</label>
              <input
                type="text"
                required
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
                placeholder="Ej: 19"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={searching}
            className="w-full md:w-auto bg-cyan-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm hover:bg-cyan-400 disabled:opacity-50 transition shadow-lg shadow-cyan-500/10"
          >
            {searching ? 'Buscando...' : 'Buscar Pedido'}
          </button>

          {searchError && <p className="text-rose-400 text-xs mt-2">{searchError}</p>}
        </form>
      )}

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
            <p className="text-slate-400 text-sm">
              {userEmail
                ? 'No se encontraron pedidos asociados a tu cuenta.'
                : 'Ingresa tus datos arriba para consultar tu pedido.'}
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const productList = parseProducts(order.products);
            const totalAmount = Number(order.total || 0);

            return (
              <div
                key={order.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition shadow-lg"
              >
                {/* Cabecera del pedido */}
                <button
                  onClick={() => toggleOrder(order.id)}
                  className="w-full p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-white text-base">
                        Pedido #{order.id}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold capitalize ${getStatusBadge(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400" suppressHydrationWarning>
                      Fecha: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                    <div className="text-left md:text-right">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Total</span>
                      <span className="font-extrabold text-cyan-400 text-lg">
                        ${totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className={`p-2 rounded-xl bg-slate-800/50 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-slate-800 text-white' : ''}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Desplegable con los detalles */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-950/60 p-5 space-y-4">
                    {/* Datos del Cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Cliente:</span>
                        <span className="font-medium text-white">{order.customer_name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Correo:</span>
                        <span className="font-medium text-white">{order.customer_email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Teléfono:</span>
                        <span className="text-slate-300">{order.customer_phone || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Dirección de Entrega:</span>
                        <span className="text-slate-300 whitespace-pre-line">{order.customer_address || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Desglose de Productos comprados */}
                    {productList.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Artículos comprados</h4>
                        <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                          {productList.map((prod, idx) => {
                            const qty = prod.quantity || 1;
                            const price = prod.price || 0;
                            return (
                              <div key={idx} className="p-3 flex justify-between items-center text-sm">
                                <div className="flex items-center space-x-3">
                                  {prod.image && (
                                    <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-slate-800" />
                                  )}
                                  <div>
                                    <p className="font-medium text-white">{prod.name || 'Producto'}</p>
                                    <p className="text-xs text-slate-500">Cantidad: {qty} x ${price}</p>
                                  </div>
                                </div>
                                <span className="font-semibold text-slate-200">${(price * qty).toLocaleString()}</span>
                              </div>
                            );
                          })}
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
