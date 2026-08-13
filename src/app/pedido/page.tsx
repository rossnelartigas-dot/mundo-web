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
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  email?: string;
  items?: OrderItem[]; // Por si tienes el desglose de productos en la tabla
}

export default function PedidoPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Estados para búsqueda de invitados
  const [searchEmail, setSearchEmail] = useState('');
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // 1. Validar sesión al cargar (Lógica intacta)
  useEffect(() => {
    async function checkAuthAndFetchOrders() {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
        
        // Obtenemos sus pedidos por user_id exactamente igual
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data);
        }
      }
      setLoading(false);
    }

    checkAuthAndFetchOrders();
  }, []);

  // 2. Manejador de búsqueda para usuarios no autenticados (Lógica intacta)
  const handleGuestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSearching(true);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('email', searchEmail.trim())
      .eq('order_number', searchOrderNumber.trim());

    setSearching(false);

    if (error || !data || data.length === 0) {
      setSearchError('No se encontró ningún pedido con esos datos.');
      setOrders([]);
    } else {
      setOrders(data);
      if (data.length > 0) setExpandedOrderId(data[0].id); // Despliega el resultado de búsqueda
    }
  };

  // Función para abrir/cerrar detalles del pedido
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Helper para asignar colores dinámicos al estado del pedido
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
      {/* Título Principal */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {userId ? 'Mis Pedidos' : 'Consulta de Pedidos'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {userId
            ? 'Gestiona y revisa el estado detallado de tus compras.'
            : 'Ingresa los datos de tu compra para obtener los detalles.'}
        </p>
      </div>

      {/* Formulario para invitados si no hay sesión */}
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
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Número de Pedido</label>
              <input
                type="text"
                required
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
                placeholder="Ej: 12345"
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

      {/* Listado de Pedidos en Acordeón */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">
          {userId ? 'Historial de Compras' : 'Resultado de Búsqueda'}
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
            <p className="text-slate-400 text-sm">
              {userId
                ? 'Aún no tienes pedidos registrados en tu cuenta.'
                : 'Ingresa tus datos arriba para consultar tu pedido.'}
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition shadow-lg"
              >
                {/* Cabecera del pedido (Presionable) */}
                <button
                  onClick={() => toggleOrderDetails(order.id)}
                  className="w-full p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-white text-base">
                        Pedido #{order.order_number || order.id.substring(0, 8)}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${getStatusBadge(order.status)}`}>
                        {order.status || 'Procesando'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Fecha: {new Date(order.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                    <div className="text-left md:text-right">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Total</span>
                      <span className="font-extrabold text-cyan-400 text-lg">
                        ${order.total_amount ? order.total_amount.toLocaleString() : '0'}
                      </span>
                    </div>

                    {/* Flecha indicadora de apertura */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Correo de contacto:</span>
                        <span className="font-medium text-white">{order.email || 'No especificado'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">ID Interno de Orden:</span>
                        <span className="font-mono text-slate-400">{order.id}</span>
                      </div>
                    </div>

                    {/* Sección para lista de productos (Si vienen en order.items) */}
                    {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Artículos comprados</h4>
                        <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
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