'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  products?: ProductItem[] | string;
}

export default function PedidoPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | number | null>(null);

  // Búsqueda de invitados
  const [searchEmail, setSearchEmail] = useState('');
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const email = session.user.email?.toLowerCase();
        const uid = session.user.id;
        
        setUserEmail(email || null);
        setUserId(uid);

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

  const handleGuestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);

    const emailQuery = searchEmail.trim().toLowerCase();
    const orderIdNum = parseInt(searchOrderNumber.trim(), 10);

    // Validar que el ID sea numérico
    if (isNaN(orderIdNum)) {
      setSearchError('SISTEMA: El ID de la orden debe ser un número válido.');
      return;
    }

    setSearching(true);

    // Primero busca por ID numérico y luego por Correo
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderIdNum)
      .eq('customer_email', emailQuery);

    setSearching(false);

    if (error || !data || data.length === 0) {
      setSearchError('SISTEMA: No se encontraron registros de este pedido.');
      setOrders([]);
    } else {
      setOrders(data);
      if (data.length > 0) setExpandedOrderId(data[0].id);
    }
  };

  const toggleOrder = (id: string | number) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const parseProducts = (productsRaw: ProductItem[] | string | undefined): ProductItem[] => {
    if (!productsRaw) return [];
    if (Array.isArray(productsRaw)) return productsRaw;
    try {
      return JSON.parse(productsRaw);
    } catch {
      return [];
    }
  };

  // Badges Neón
  const getStatusBadge = (status?: string) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'paid' || s === 'completado' || s === 'delivered') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
    }
    if (s === 'pending' || s === 'pendiente') {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
    }
    if (s === 'cancelled' || s === 'cancelado') {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]';
    }
    return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-xs tracking-widest text-cyan-400/80 uppercase font-mono animate-pulse">
          Sincronizando datos...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 py-8 px-4 md:px-8 relative overflow-hidden">
      
      {/* Glow ambiental de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-4xl h-96 bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Barra de navegación superior con botón Volver al Inicio */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition group bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-md hover:border-cyan-500/40"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>← Volver a la Tienda</span>
          </Link>

          <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Terminal // V2.0</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {userEmail ? (
              <>Historial de <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">Pedidos</span></>
            ) : (
              <>Consulta de <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">Órdenes</span></>
            )}
          </h1>
          <p className="text-slate-400 text-sm">
            {userEmail
              ? `Sesión activa: ${userEmail}`
              : 'Módulo de rastreo y verificación de entregas.'}
          </p>
        </div>

        {/* Formulario Estilo Cyberpunk para Invitados */}
        {!userId && (
          <form 
            onSubmit={handleGuestSearch} 
            className="relative group bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition shadow-2xl space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h2 className="text-xs font-semibold text-slate-300 tracking-wide uppercase font-mono">
                [ Consultar como invitado ]
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                  ID de Orden
                </label>
                <input
                  type="text"
                  required
                  value={searchOrderNumber}
                  onChange={(e) => setSearchOrderNumber(e.target.value)}
                  placeholder="Ej: 19"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:ring-1 focus:ring-cyan-500/30 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                  Correo Registrado
                </label>
                <input
                  type="email"
                  required
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="usuario@dominio.com"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={searching}
              className="w-full md:w-auto relative bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              {searching ? 'Buscando...' : 'Rastrear Pedido →'}
            </button>

            {searchError && (
              <p className="text-rose-400 text-xs font-mono bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg mt-2">
                {searchError}
              </p>
            )}
          </form>
        )}

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 space-y-3">
              <p className="text-slate-400 text-sm font-medium">
                {userEmail
                  ? 'No se encontraron compras asociadas a tu cuenta.'
                  : 'Ingresa tus datos en el formulario para consultar.'}
              </p>
              <Link 
                href="/" 
                className="inline-block text-xs font-mono text-cyan-400 hover:underline"
              >
                Ir al catálogo de productos →
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const productList = parseProducts(order.products);
              const totalAmount = Number(order.total || 0);

              return (
                <div
                  key={order.id}
                  className={`group bg-slate-900/80 backdrop-blur-md border transition-all duration-300 rounded-2xl overflow-hidden shadow-xl ${
                    isExpanded ? 'border-cyan-500/50 ring-1 ring-cyan-500/20' : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Cabecera Interactiva */}
                  <button
                    onClick={() => toggleOrder(order.id)}
                    className="w-full p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs text-slate-500">ID:</span>
                        <span className="font-bold font-mono text-white text-base tracking-wide">
                          #{order.id}
                        </span>
                        <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono" suppressHydrationWarning>
                        FECHA: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end space-x-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                      <div className="text-left md:text-right">
                        <span className="block text-[10px] text-slate-500 uppercase font-mono tracking-wider">Monto Total</span>
                        <span className="font-extrabold text-cyan-400 text-xl font-mono">
                          ${totalAmount.toLocaleString()}
                        </span>
                      </div>

                      <div className={`p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : ''}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Área Expandible */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 bg-slate-950/90 p-5 space-y-5">
                      {/* Detalles del Cliente */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-900/80 p-4 rounded-xl border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 font-mono block mb-1">DESTINATARIO:</span>
                          <span className="font-medium text-white text-sm">{order.customer_name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-mono block mb-1">CORREO CONTACTO:</span>
                          <span className="font-medium text-cyan-400">{order.customer_email || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-mono block mb-1">TELÉFONO:</span>
                          <span className="text-slate-300 font-mono">{order.customer_phone || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-mono block mb-1">DIRECCIÓN DE ENTREGA:</span>
                          <span className="text-slate-300 whitespace-pre-line leading-relaxed">{order.customer_address || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Desglose de Productos */}
                      {productList.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            <span>Items comprados ({productList.length})</span>
                          </h4>
                          
                          <div className="divide-y divide-slate-800/60 border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/40">
                            {productList.map((prod, idx) => {
                              const qty = prod.quantity || 1;
                              const price = prod.price || 0;
                              return (
                                <div key={idx} className="p-3.5 flex justify-between items-center text-sm hover:bg-slate-800/20 transition">
                                  <div className="flex items-center space-x-3">
                                    {prod.image ? (
                                      <img 
                                        src={prod.image} 
                                        alt={prod.name} 
                                        className="w-11 h-11 object-cover rounded-lg border border-slate-800 bg-slate-950" 
                                      />
                                    ) : (
                                      <div className="w-11 h-11 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-600 font-mono text-xs">
                                        IMG
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-semibold text-white">{prod.name || 'Producto'}</p>
                                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                                        Cant: {qty} × <span className="text-slate-400">${price}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-bold font-mono text-slate-200">${(price * qty).toLocaleString()}</span>
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
    </div>
  );
}