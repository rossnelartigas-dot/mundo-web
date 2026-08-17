"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { 
  Package, 
  ShoppingCart, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Search
} from "lucide-react";

// Configuración del cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface InventoryProduct {
  id: number | string;
  name: string;
  category: string;
  sku?: string;
  image: string | null;
  price: number;
  stock: number;
  ordered_units: number;
}

interface OrderItemResponse {
  product_id: number | string;
  quantity: number;
  orders: {
    status: string;
  } | { status: string }[] | null;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<number | string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Estados para Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // ---------------------------------------------------------------------------
  // 1. CARGAR PRODUCTOS Y CÁLCULO DE PEDIDOS DESDE SUPABASE
  // ---------------------------------------------------------------------------
  const fetchInventory = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setLoading(true);
    }

    try {
      // Consulta de productos (incluye category y sku)
      const { data: productsData, error: prodError } = await supabase
        .from("products")
        .select("id, name, category, sku, image, price, stock")
        .order("name", { ascending: true });

      if (prodError) throw prodError;

      // Consulta de items de pedidos activos
      const { data: orderItemsData, error: orderError } = await supabase
        .from("order_items")
        .select("product_id, quantity, orders!inner(status)")
        .neq("orders.status", "cancelado");

      if (orderError) {
        console.warn("Aviso al consultar order_items:", orderError.message);
      }

      // Mapeo de unidades pedidas por producto
      const orderedMap: Record<string, number> = {};
      if (orderItemsData) {
        (orderItemsData as unknown as OrderItemResponse[]).forEach((item) => {
          const key = String(item.product_id);
          const qty = Number(item.quantity) || 0;
          
          const orderStatus = Array.isArray(item.orders) 
            ? item.orders[0]?.status 
            : item.orders?.status;

          if (orderStatus !== "cancelado") {
            orderedMap[key] = (orderedMap[key] || 0) + qty;
          }
        });
      }

      // Combinar productos con sus pedidos
      const formatted: InventoryProduct[] = (productsData || []).map((p) => ({
        id: p.id,
        name: p.name || "Sin nombre",
        category: p.category || "General",
        sku: p.sku || "",
        image: p.image || null,
        price: Number(p.price) || 0,
        stock: Math.max(0, Number(p.stock) || 0),
        ordered_units: orderedMap[String(p.id)] || 0,
      }));

      setProducts(formatted);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar datos.";
      console.error("Error al cargar inventario:", err);
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    let isSubscribed = true;

    const loadData = async () => {
      await fetchInventory(false);
    };

    if (isSubscribed) {
      loadData();
    }

    return () => {
      isSubscribed = false;
    };
  }, [fetchInventory]);

  // ---------------------------------------------------------------------------
  // 2. MANEJAR CAMBIOS LOCALES EN EL STOCK
  // ---------------------------------------------------------------------------
  const handleStockChange = (id: number | string, newStock: number) => {
    const val = isNaN(newStock) ? 0 : Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: val } : item))
    );
  };

  // ---------------------------------------------------------------------------
  // 3. GUARDAR EL NUEVO STOCK EN SUPABASE
  // ---------------------------------------------------------------------------
  const saveStockToSupabase = async (id: number | string, newStock: number) => {
    setSavingId(id);

    try {
      const { error } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", id);

      if (error) throw error;

      showNotification("Stock actualizado correctamente en Supabase.", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      console.error("Error al actualizar el stock:", err);
      showNotification(`No se pudo actualizar: ${message}`, "error");
    } finally {
      setSavingId(null);
    }
  };

  // ---------------------------------------------------------------------------
  // 4. LÓGICA DE FILTRADO Y CATEGORÍAS
  // ---------------------------------------------------------------------------
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCat = selectedCategory === "Todas" || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, selectedCategory]);

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
          onClick={() => fetchInventory(true)}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs px-4 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          Recargar Datos
        </button>
      </div>

      {/* NOTIFICACIÓN */}
      {notification && (
        <div className={`border px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
          notification.type === 'error' 
            ? 'bg-red-950/80 border-red-500/50 text-red-200' 
            : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
        }`}>
          {notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-sm font-medium font-mono">{notification.message}</span>
        </div>
      )}

      {/* BARRA DE FILTROS */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
            <span>Filtrar inventario:</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar por producto o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="Todas">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE INVENTARIO */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <span className="font-mono text-sm">Cargando inventario desde Supabase...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono">
                      No se encontraron productos que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item) => {
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
                              src={item.image && item.image.trim() !== "" ? item.image : "/no-image.png"}
                              alt={item.name}
                              fill
                              unoptimized
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{item.name}</span>
                            <span className="text-[10px] text-slate-500 block">
                              {item.category} {item.sku ? `• SKU: ${item.sku}` : ''}
                            </span>
                          </div>
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
                                handleStockChange(item.id, parseInt(e.target.value, 10))
                              }
                              className="w-20 bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-2 text-center text-white font-mono font-bold focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                            <button
                              onClick={() => saveStockToSupabase(item.id, item.stock)}
                              disabled={isSaving}
                              title="Guardar nuevo stock"
                              className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition border border-cyan-400/30 disabled:bg-slate-800 cursor-pointer"
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
          </div>
        )}
      </div>
    </div>
  );
}