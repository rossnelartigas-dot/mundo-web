'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // 👈 Importación correcta de tu proyecto

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  email?: string;
}

export default function PedidoPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Estados para búsqueda de invitados
  const [searchEmail, setSearchEmail] = useState('');
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // 1. Validar sesión al cargar
  useEffect(() => {
    async function checkAuthAndFetchOrders() {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
        
        // Si hay usuario, obtenemos TODOS sus pedidos por user_id
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

  // 2. Manejador de búsqueda para usuarios no autenticados
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
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400">Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Consulta de Pedidos</h1>

      {/* Formulario para invitados si no hay sesión */}
      {!userId && (
        <form onSubmit={handleGuestSearch} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-semibold text-white">Consultar como invitado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Número de Pedido</label>
              <input
                type="text"
                required
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
                placeholder="Ej: 12345"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-cyan-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-cyan-400 disabled:opacity-50 transition"
          >
            {searching ? 'Buscando...' : 'Buscar Pedido'}
          </button>

          {searchError && <p className="text-red-400 text-xs mt-2">{searchError}</p>}
        </form>
      )}

      {/* Listado de Pedidos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">
          {userId ? 'Mis Pedidos' : 'Resultado de Búsqueda'}
        </h2>

        {orders.length === 0 ? (
          <p className="text-slate-400 text-sm">
            {userId
              ? 'Aún no tienes pedidos registrados.'
              : 'Ingresa tus datos arriba para consultar tu pedido.'}
          </p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-slate-800 rounded-2xl p-4 bg-slate-900/60 text-white space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-sm">Pedido #{order.order_number || order.id}</span>
                <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase font-semibold">
                  {order.status || 'Procesando'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Fecha: {new Date(order.created_at).toLocaleDateString()}</span>
                <span className="font-semibold text-slate-200 text-sm">Total: ${order.total_amount || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}