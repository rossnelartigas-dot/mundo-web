"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Calculator, 
  Save, 
  Search, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Percent,
  Sparkles,
  Tag,
  Trash2
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  cost_price: number;
  profit_margin: number;
  price: number;
  discount: number;
  stock: number;
  active: boolean;
}

const IVA_RATE = 0.16; // 16% IVA

export default function AdminPricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const [globalMargin, setGlobalMargin] = useState<number>(30);
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);

  // ---------------------------------------------------------------------------
  // 1. CARGAR PRODUCTOS (Optimizado para evitar setState en Render/Effect)
  // ---------------------------------------------------------------------------
  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category, subcategory, brand, sku, cost_price, profit_margin, price, discount, stock, active")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error al cargar productos de Supabase:", error);
    } else if (data) {
      const formatted = data.map((p) => ({
        ...p,
        cost_price: Number(p.cost_price) || 0,
        profit_margin: Number(p.profit_margin) || 30,
        price: Number(p.price) || 0,
        discount: Number(p.discount) || 0,
        stock: Number(p.stock) || 0,
      }));
      setProducts(formatted);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    async function loadInitialData() {
      if (!isSubscribed) return;
      await fetchProducts();
    }

    loadInitialData();

    return () => {
      isSubscribed = false;
    };
  }, [fetchProducts]);

  // ---------------------------------------------------------------------------
  // 2. APLICAR MARGEN MASIVO
  // ---------------------------------------------------------------------------
  const handleApplyGlobalMargin = () => {
    if (isNaN(globalMargin) || globalMargin < 0) return;

    setProducts((prev) =>
      prev.map((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCat = selectedCategory === "Todas" || p.category === selectedCategory;

        if (!matchesSearch || !matchesCat) return p;

        const baseCost = p.cost_price > 0 ? p.cost_price : p.price;
        const newPrice = baseCost * (1 + globalMargin / 100);

        return {
          ...p,
          cost_price: baseCost,
          profit_margin: globalMargin,
          price: Number(newPrice.toFixed(2)),
        };
      })
    );

    setNotification(`¡Se aplicó un ${globalMargin}% de ganancia! Recuerda guardar los cambios.`);
    setTimeout(() => setNotification(null), 5000);
  };

  // ---------------------------------------------------------------------------
  // 3. APLICAR / ELIMINAR DESCUENTOS MASIVOS
  // ---------------------------------------------------------------------------
  const handleApplyGlobalDiscount = (discountValue: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCat = selectedCategory === "Todas" || p.category === selectedCategory;

        if (!matchesSearch || !matchesCat) return p;

        return {
          ...p,
          discount: Math.max(0, discountValue),
        };
      })
    );

    setNotification(
      discountValue === 0 
        ? "¡Se han eliminado todos los descuentos!" 
        : `¡Se aplicó un descuento del ${discountValue}%!`
    );
    setTimeout(() => setNotification(null), 5000);
  };

  // ---------------------------------------------------------------------------
  // 4. CAMBIOS INDIVIDUALES EN TIEMPO REAL
  // ---------------------------------------------------------------------------
  const handleValueChange = (
    id: number,
    field: "cost_price" | "profit_margin" | "price" | "discount",
    value: number
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        const val = Math.max(0, value);
        const updated = { ...p, [field]: val };

        if (field === "cost_price" || field === "profit_margin") {
          const newPrice = updated.cost_price * (1 + updated.profit_margin / 100);
          updated.price = Number(newPrice.toFixed(2));
        } else if (field === "price") {
          if (updated.cost_price > 0) {
            const calculatedMargin = ((updated.price - updated.cost_price) / updated.cost_price) * 100;
            updated.profit_margin = Number(calculatedMargin.toFixed(2));
          }
        }

        return updated;
      })
    );
  };

  // ---------------------------------------------------------------------------
  // 5. GUARDAR CAMBIOS MASIVOS (OPTIMIZADO CON .UPSERT)
  // ---------------------------------------------------------------------------
  const saveToSupabase = async () => {
    setSaving(true);
    setNotification(null);

    try {
      const payload = products.map((p) => ({
        id: p.id,
        cost_price: p.cost_price,
        profit_margin: p.profit_margin,
        price: p.price,
        discount: p.discount,
      }));

      const { error } = await supabase
        .from("products")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        console.error("Error al actualizar en Supabase:", error);
        alert(`Error al guardar en la base de datos: ${error.message}`);
      } else {
        setNotification("¡Precios, costos y márgenes guardados exitosamente en Supabase!");
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error("Error inesperado al guardar:", err);
      alert("Ocurrió un error inesperado al intentar guardar los precios.");
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 6. MÉTRICAS FINANCIERAS
  // ---------------------------------------------------------------------------
  const metrics = useMemo(() => {
    let totalCost = 0;
    let totalRevenue = 0;
    let totalNetProfit = 0;

    products.forEach((p) => {
      const finalPrice = p.price * (1 - p.discount / 100);
      const priceBeforeIVA = finalPrice / (1 + IVA_RATE);
      const netProfitUnit = priceBeforeIVA - p.cost_price;

      const qty = p.stock > 0 ? p.stock : 1;
      totalCost += p.cost_price * qty;
      totalRevenue += finalPrice * qty;
      totalNetProfit += netProfitUnit * qty;
    });

    const averageMargin = totalCost > 0 ? (totalNetProfit / totalCost) * 100 : 0;

    return { totalCost, totalRevenue, totalNetProfit, averageMargin };
  }, [products]);

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
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen space-y-6 font-sans">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-cyan-400">
            <Calculator className="w-7 h-7 text-cyan-400" />
            Panel de Ajuste de Precios y Rentabilidad
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sincronización optimizada con Supabase (<code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">cost_price</code>, <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">profit_margin</code>, <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">price</code>, <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">discount</code>).
          </p>
        </div>

        <button 
          onClick={saveToSupabase}
          disabled={saving || loading}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-lg transition border border-cyan-400/30 shadow-lg shadow-cyan-950"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Guardando..." : "Guardar en Supabase"}
        </button>
      </div>

      {/* NOTIFICACIÓN */}
      {notification && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Inversión en Inventario</span>
          <div className="text-xl font-bold text-slate-200 mt-1">${metrics.totalCost.toFixed(2)}</div>
          <span className="text-xs text-slate-500">Costo total acumulado</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Venta Estimada (Con IVA)</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">${metrics.totalRevenue.toFixed(2)}</div>
          <span className="text-xs text-emerald-500/80">Incluye IVA y descuentos</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Ganancia Neta Limpia</span>
          <div className="text-xl font-bold text-cyan-400 mt-1">${metrics.totalNetProfit.toFixed(2)}</div>
          <span className="text-xs text-cyan-500/80">Deduciendo IVA (16%) y costo</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Margen Neto Promedio</span>
          <div className="text-xl font-bold text-indigo-400 mt-1">{metrics.averageMargin.toFixed(1)}%</div>
          <span className="text-xs text-indigo-500/80">Rendimiento sobre costo base</span>
        </div>
      </div>

      {/* FILTROS Y CONTROLES MASIVOS */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
            <span>Filtrar productos a modificar:</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {/* MARGEN MASIVO */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/50 p-3 rounded-lg border border-indigo-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Margen de Ganancia</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950 border border-indigo-500/40 rounded-lg px-2 py-1">
                <input 
                  type="number" 
                  step="1"
                  value={globalMargin}
                  onChange={(e) => setGlobalMargin(parseFloat(e.target.value) || 0)}
                  className="w-14 bg-transparent text-indigo-300 font-mono font-bold text-center focus:outline-none text-sm"
                />
                <Percent className="w-3.5 h-3.5 text-indigo-400 ml-1" />
              </div>

              <button
                onClick={handleApplyGlobalMargin}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition border border-indigo-400/30"
              >
                Aplicar % Margen
              </button>
            </div>
          </div>

          {/* DESCUENTO MASIVO */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/50 p-3 rounded-lg border border-amber-500/20">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Promociones y Descuentos</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950 border border-amber-500/40 rounded-lg px-2 py-1">
                <input 
                  type="number" 
                  step="1"
                  value={globalDiscount}
                  onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                  className="w-14 bg-transparent text-amber-300 font-mono font-bold text-center focus:outline-none text-sm"
                />
                <Percent className="w-3.5 h-3.5 text-amber-400 ml-1" />
              </div>

              <button
                onClick={() => handleApplyGlobalDiscount(globalDiscount)}
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition border border-amber-400/30"
              >
                Aplicar % Desc
              </button>

              <button
                onClick={() => handleApplyGlobalDiscount(0)}
                disabled={loading}
                title="Quitar todos los descuentos (0%)"
                className="bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Quitar Desc.</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE PRECIOS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <span>Sincronizando con Supabase...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Producto</th>
                <th className="p-3 text-center">Costo ($)</th>
                <th className="p-3 text-center">% Ganancia</th>
                <th className="p-3 text-center">Precio Venta ($)</th>
                <th className="p-3 text-center">Desc (%)</th>
                <th className="p-3 text-center">P. Final ($)</th>
                <th className="p-3 text-center">Ganancia Neta / u</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((product) => {
                const finalPrice = product.price * (1 - product.discount / 100);
                const priceBeforeIVA = finalPrice / (1 + IVA_RATE);
                const netProfitUnit = priceBeforeIVA - product.cost_price;
                const isNegative = netProfitUnit <= 0;

                return (
                  <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-medium text-slate-200 max-w-xs">
                      <div className="truncate">{product.name}</div>
                      <span className="text-[10px] text-slate-500 block">
                        {product.category} {product.sku ? `• SKU: ${product.sku}` : ''}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <input 
                        type="number" 
                        step="0.01"
                        value={product.cost_price || ""}
                        onChange={(e) => handleValueChange(product.id, "cost_price", parseFloat(e.target.value) || 0)}
                        className="w-24 bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-100 text-center font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </td>

                    <td className="p-3 text-center">
                      <div className="relative inline-block">
                        <input 
                          type="number" 
                          step="0.1"
                          value={product.profit_margin || ""}
                          onChange={(e) => handleValueChange(product.id, "profit_margin", parseFloat(e.target.value) || 0)}
                          className="w-20 bg-slate-950 border border-indigo-500/50 rounded p-1.5 text-indigo-300 text-center font-mono font-semibold focus:border-indigo-400 focus:outline-none"
                        />
                        <span className="text-xs text-indigo-400 ml-1">%</span>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <input 
                        type="number" 
                        step="0.01"
                        value={product.price || ""}
                        onChange={(e) => handleValueChange(product.id, "price", parseFloat(e.target.value) || 0)}
                        className="w-24 bg-slate-950 border border-emerald-500/50 rounded p-1.5 text-emerald-400 text-center font-mono font-bold focus:border-emerald-400 focus:outline-none"
                      />
                    </td>

                    <td className="p-3 text-center">
                      <div className="relative inline-block">
                        <input 
                          type="number" 
                          value={product.discount || 0}
                          onChange={(e) => handleValueChange(product.id, "discount", parseFloat(e.target.value) || 0)}
                          className={`w-16 bg-slate-950 border rounded p-1.5 text-center font-mono focus:outline-none ${
                            product.discount > 0 
                              ? "border-amber-500/80 text-amber-400 font-bold" 
                              : "border-slate-800 text-slate-400"
                          }`}
                        />
                        {product.discount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-bold text-[9px] px-1 rounded-full">
                            OFF
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-center font-mono font-bold text-emerald-300">
                      ${finalPrice.toFixed(2)}
                    </td>

                    <td className={`p-3 text-center font-mono font-bold ${isNegative ? "text-rose-500" : "text-cyan-400"}`}>
                      <div className="flex items-center justify-center gap-1">
                        {isNegative && <AlertCircle className="w-3.5 h-3.5" />}
                        ${netProfitUnit.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}