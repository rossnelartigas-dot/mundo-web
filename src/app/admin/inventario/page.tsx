"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { 
  Package, 
  ShoppingCart, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw 
} from "lucide-react";

// Configuración del cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface InventoryProduct {
  id: number | string;
  name: string;
  image: string | null;
  price: number;
  stock: number;
  ordered_units: number; // Suma de unidades en pedidos
}

export default function InventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<number | string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // 1. CARGAR PRODUCTOS Y CÁLCULO DE PEDIDOS DESDE SUPABASE
  // ---------------------------------------------------------------------------
  const fetchInventory = async () => {
    setLoading(true);

    // Consulta de productos
    const { data: productsData, error: prodError } = await supabase
      .from("products")
      .select("id, name, image, price, stock")
      .order("name", { ascending: true });

    if (prodError) {
      console.error("Error al cargar productos:", prodError);
      setLoading(false);
      return;
    }

    // Consulta de items de pedidos activos
    const { data: orderItemsData, error: orderError } = await supabase
      .from("order_items")
      .select("product_id, quantity, orders!inner(status)")
      .neq("orders.status", "cancelado");

    if (orderError) {
      console.warn("Aviso: No se pudieron calcular pedidos (verifica la tabla order_items):", orderError);
    }

    // Mapeo de unidades pedidas por producto
    const orderedMap: Record<string | number, number> = {};
    if (orderItemsData) {
      orderItemsData.forEach((item: any) => {
        const pId = item.product_id;
        const qty = Number(item.quantity) || 0;
        orderedMap[pId] = (orderedMap[pId] || 0) + qty;
      });
    }

    // Combinar productos con sus pedidos
    const formatted: InventoryProduct[] = (productsData || []).map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      price: Number(p.price) || 0,
      stock: Number(p.stock) || 0,
      ordered_units: orderedMap[p.id] || 0,
    }));

    setProducts(formatted);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // ---------------------------------------------------------------------------
  // 2. MANEJAR CAMBIOS LOCALES EN EL STOCK
  // ---------------------------------------------------------------------------
  const handleStockChange = (id: number | string, newStock: number) => {
    const val = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: val } : item))
    );
  };

  // ---------------------------------------------------------------------------
  // 3. GUARDAR EL NUEVO STOCK EN SUPABASE
  // ---------------------------------------------------------------------------
  const saveStockToSupabase = async (id: number | string, newStock: number) => {
    setSavingId(id);
    setNotification(null);

    const { error } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", id);

    setSavingId(null);

    if (error) {
      console.error("Error al actualizar el stock:", error);
      alert(`No se pudo actualizar el stock: ${error.message}`);
    } else {
      setNotification(`Stock actualizado correctamente en Supabase.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-100 p-6">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package className="w-8 h-8 text-cyan-400" />
            Control de Inventario y Pedidos
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Modifica las existencias reales y visualiza los pedidos activos en un solo panel.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs px-4 py-2 rounded-xl transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          Recargar Datos
        </button>
      </div>

      {/* NOTIFICACIÓN */}
      {notification && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium font-mono">{notification}</span>
        </div>
      )}

      {/* TABLA PRINCIPAL DE INVENTARIO */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <span className="font-mono text-sm">Cargando inventario desde Supabase...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/90 text-cyan-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4 text-center">Precio</th>
                <th className="px-6 py-4 text-center">En Pedidos</th>
                <th className="px-6 py-4 text-center">Stock Actual (Editable)</th>
                <th className="px-6 py-4 text-center">Estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono">
                    No hay productos registrados en la base de datos.
                  </td>
                </tr>
              ) : (
                products.map((item) => {
                  const stock = item.stock;
                  const isOutOfStock = stock <= 0;
                  const isLowStock = stock > 0 && stock <= 3;
                  const isSaving = savingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      {/* Producto (Imagen y Nombre) */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-10 w-10 relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shrink-0">
                          <Image
                            src={item.image || "/no-image.png"}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-white">{item.name}</span>
                      </td>

                      {/* Precio */}
                      <td className="px-6 py-4 text-center font-mono text-slate-400">
                        ${item.price.toFixed(2)}
                      </td>

                      {/* Unidades Comprometidas en Pedidos */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-amber-400 font-mono text-xs font-bold">
                          <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                          <span>{item.ordered_units} ud.</span>
                        </div>
                      </td>

                      {/* Stock Editable + Guardar */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={item.stock}
                            onChange={(e) =>
                              handleStockChange(item.id, parseInt(e.target.value) || 0)
                            }
                            className="w-20 bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-2 text-center text-white font-mono font-bold focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                          <button
                            onClick={() => saveStockToSupabase(item.id, item.stock)}
                            disabled={isSaving}
                            title="Guardar nuevo stock"
                            className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition border border-cyan-400/30 disabled:bg-slate-800"
                          >
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Estado / Insignia */}
                      <td className="px-6 py-4 text-center font-mono text-xs">
                        {isOutOfStock ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-bold inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Agotado
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                            Poco Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                            Disponible
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}