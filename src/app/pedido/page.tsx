'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Ajusta la ruta a tu cliente de Supabase

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  email?: string;
}

export default function PedidoPage() {
  const supabase = createClient();

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
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        // Si hay usuario, obtenemos TODOS sus pedidos con user_id
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data);
        }
      }
      setLoading(false);
    }

    checkAuthAndFetchOrders();
  }, [supabase]);

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
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Consulta de Pedidos</h1>

      {/* Si no hay usuario en sesión, mostramos el formulario de consulta pública */}
      {!userId && (
        <form onSubmit={handleGuestSearch} className="bg-white p-6 rounded-lg shadow space-y-4 border">
          <h2 className="text-lg font-semibold">Consultar como invitado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full border rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Número de Pedido</label>
              <input
                type="text"
                required
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
                placeholder="Ej: 12345"
                className="w-full border rounded p-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {searching ? 'Buscando...' : 'Buscar Pedido'}
          </button>

          {searchError && <p className="text-red-500 text-sm mt-2">{searchError}</p>}
        </form>
      )}

      {/* Listado de Pedidos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {userId ? 'Mis Pedidos' : 'Resultado de Búsqueda'}
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">
            {userId
              ? 'Aún no tienes pedidos registrados.'
              : 'Ingresa tus datos arriba para consultar tu pedido.'}
          </p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-2">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold">Pedido #{order.order_number}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Fecha: {new Date(order.created_at).toLocaleDateString()}</span>
                <span className="font-semibold text-gray-900">Total: ${order.total_amount}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}