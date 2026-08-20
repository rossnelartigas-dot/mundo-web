"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import {
  Package,
  ShoppingCart,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

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

interface OrderProduct {
  id: number | string;
  name?: string;
  quantity?: number;
  price?: number;
  image?: string;
}

interface OrderResponse {
  id: number;
  status: string | null;
  products: OrderProduct[] | null;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<number | string | null>(
    null
  );

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ============================================================
  // FILTROS
  // ============================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("Todas");

  // ============================================================
  // NOTIFICACIONES
  // ============================================================

  const showNotification = useCallback(
    (
      message: string,
      type: "success" | "error" = "success"
    ) => {
      setNotification({
        message,
        type,
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    },
    []
  );

  // ============================================================
  // OBTENER URL DE IMAGEN
  // ============================================================

  const getImageUrl = (image: unknown): string => {
    if (typeof image === "string" && image.trim() !== "") {
      return image;
    }

    if (Array.isArray(image)) {
      const firstImage = image.find(
        (item): item is string =>
          typeof item === "string" && item.trim() !== ""
      );

      if (firstImage) {
        return firstImage;
      }
    }

    return "/images/placeholder.png";
  };

  // ============================================================
  // CARGAR INVENTARIO
  // ============================================================

  const fetchInventory = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setLoading(true);
      }

      try {
        // ========================================================
        // 1. PRODUCTOS
        // ========================================================

        const {
          data: productsData,
          error: prodError,
        } = await supabase
          .from("products")
          .select(
            "id, name, category, sku, image, price, stock"
          )
          .order("name", {
            ascending: true,
          });

        if (prodError) {
          throw prodError;
        }

        // ========================================================
        // 2. PEDIDOS
        //
        // Los productos están guardados directamente en:
        // orders.products
        //
        // Ya NO utilizamos order_items.
        // ========================================================

        const {
          data: ordersData,
          error: ordersError,
        } = await supabase
          .from("orders")
          .select("id, status, products");

        if (ordersError) {
          console.warn(
            "Aviso al consultar pedidos:",
            ordersError.message
          );
        }

        // ========================================================
        // 3. CALCULAR UNIDADES EN PEDIDOS ACTIVOS
        // ========================================================

        const orderedMap: Record<string, number> = {};

        if (ordersData) {
          (ordersData as OrderResponse[]).forEach((order) => {
            const status =
              String(order.status || "").toLowerCase().trim();

            // No contabilizar pedidos cancelados
            const isCancelled =
              status === "cancelado" ||
              status === "cancelled";

            if (isCancelled) {
              return;
            }

            if (!Array.isArray(order.products)) {
              return;
            }

            order.products.forEach((item) => {
              if (
                item?.id === undefined ||
                item?.id === null
              ) {
                return;
              }

              const productId = String(item.id);

              const quantity =
                Number(item.quantity) || 0;

              if (quantity <= 0) {
                return;
              }

              orderedMap[productId] =
                (orderedMap[productId] || 0) +
                quantity;
            });
          });
        }

        // ========================================================
        // 4. COMBINAR PRODUCTOS + PEDIDOS
        // ========================================================

        const formatted: InventoryProduct[] = (
          productsData || []
        ).map((product) => ({
          id: product.id,

          name:
            product.name?.trim() ||
            "Sin nombre",

          category:
            product.category?.trim() ||
            "General",

          sku:
            product.sku?.trim() ||
            "",

          image: getImageUrl(product.image),

          price:
            Number(product.price) || 0,

          stock: Math.max(
            0,
            Number(product.stock) || 0
          ),

          ordered_units:
            orderedMap[String(product.id)] || 0,
        }));

        setProducts(formatted);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar datos.";

        console.error(
          "Error al cargar inventario:",
          err
        );

        showNotification(
          errorMessage,
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  // ============================================================
  // CARGA INICIAL
  // ============================================================

  useEffect(() => {
    fetchInventory(false);
  }, [fetchInventory]);

  // ============================================================
  // CAMBIAR STOCK LOCALMENTE
  // ============================================================

  const handleStockChange = (
    id: number | string,
    newStock: number
  ) => {
    const value = Number.isNaN(newStock)
      ? 0
      : Math.max(0, newStock);

    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        item.id === id
          ? {
              ...item,
              stock: value,
            }
          : item
      )
    );
  };

  // ============================================================
  // GUARDAR STOCK
  // ============================================================

  const saveStockToSupabase = async (
    id: number | string,
    newStock: number
  ) => {
    setSavingId(id);

    try {
      const cleanStock = Math.max(
        0,
        Number(newStock) || 0
      );

      const {
        error,
      } = await supabase
        .from("products")
        .update({
          stock: cleanStock,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Actualizamos también el estado local
      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === id
            ? {
                ...item,
                stock: cleanStock,
              }
            : item
        )
      );

      showNotification(
        "Stock actualizado correctamente.",
        "success"
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error desconocido";

      console.error(
        "Error al actualizar el stock:",
        err
      );

      showNotification(
        `No se pudo actualizar: ${message}`,
        "error"
      );
    } finally {
      setSavingId(null);
    }
  };

  // ============================================================
  // CATEGORÍAS
  // ============================================================

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b, "es")
    );
  }, [products]);

  // ============================================================
  // FILTRADO
  // ============================================================

  const filteredProducts = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        Boolean(
          product.sku
            ?.toLowerCase()
            .includes(normalizedSearch)
        );

      const matchesCategory =
        selectedCategory === "Todas" ||
        product.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
  ]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 text-slate-100">

      {/* ========================================================
          CABECERA
      ======================================================== */}

      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-white">
            <Package className="h-8 w-8 text-cyan-400" />

            Control de Inventario y Pedidos
          </h1>

          <p className="mt-1 font-mono text-xs text-slate-400">
            Modifica las existencias reales y visualiza
            los pedidos activos en un solo panel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchInventory(true)}
          disabled={loading}
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-mono text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading
                ? "animate-spin text-cyan-400"
                : ""
            }`}
          />

          Recargar Datos
        </button>
      </div>

      {/* ========================================================
          NOTIFICACIÓN
      ======================================================== */}

      {notification && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
            notification.type === "error"
              ? "border-red-500/50 bg-red-950/80 text-red-200"
              : "border-emerald-500/50 bg-emerald-950/80 text-emerald-200"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          )}

          <span className="font-mono text-sm font-medium">
            {notification.message}
          </span>
        </div>
      )}

      {/* ========================================================
          FILTROS
      ======================================================== */}

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <span>
              Filtrar inventario:
            </span>
          </div>

          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">

            {/* BUSCADOR */}

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />

              <input
                type="text"
                placeholder="Buscar por producto o SKU..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* CATEGORÍA */}

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-sm font-medium text-slate-200 focus:border-cyan-500 focus:outline-none sm:w-auto"
            >
              <option value="Todas">
                Todas las categorías
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================
          TABLA
      ======================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md">

        {loading ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />

            <span className="font-mono text-sm">
              Cargando inventario desde Supabase...
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm text-slate-300">

              <thead className="border-b border-slate-800 bg-slate-950/90 font-mono text-xs uppercase tracking-wider text-cyan-400">
                <tr>
                  <th className="px-6 py-4">
                    Producto
                  </th>

                  <th className="px-6 py-4 text-center">
                    Precio
                  </th>

                  <th className="px-6 py-4 text-center">
                    En Pedidos
                  </th>

                  <th className="px-6 py-4 text-center">
                    Stock Actual
                  </th>

                  <th className="px-6 py-4 text-center">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">

                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center font-mono text-slate-500"
                    >
                      No se encontraron productos
                      que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(
                    (item) => {
                      const stock =
                        item.stock;

                      const isOutOfStock =
                        stock <= 0;

                      const isLowStock =
                        stock > 0 &&
                        stock <= 3;

                      const isSaving =
                        savingId === item.id;

                      return (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-slate-800/40"
                        >

                          {/* PRODUCTO */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">

                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">

                                <Image
                                  src={getImageUrl(
                                    item.image
                                  )}
                                  alt={
                                    item.name
                                  }
                                  fill
                                  sizes="40px"
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>

                              <div>
                                <span className="block font-semibold text-white">
                                  {item.name}
                                </span>

                                <span className="block text-[10px] text-slate-500">
                                  {item.category}

                                  {item.sku
                                    ? ` • SKU: ${item.sku}`
                                    : ""}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* PRECIO */}

                          <td className="px-6 py-4 text-center font-mono text-slate-400">
                            $
                            {item.price.toFixed(
                              2
                            )}
                          </td>

                          {/* PEDIDOS */}

                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 font-mono text-xs font-bold text-amber-400">

                              <ShoppingCart className="h-3.5 w-3.5 text-amber-400" />

                              <span>
                                {
                                  item.ordered_units
                                }{" "}
                                ud.
                              </span>
                            </div>
                          </td>

                          {/* STOCK */}

                          <td className="px-6 py-4 text-center">

                            <div className="inline-flex items-center gap-2">

                              <input
                                type="number"
                                min="0"
                                value={
                                  item.stock
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleStockChange(
                                    item.id,
                                    parseInt(
                                      event
                                        .target
                                        .value,
                                      10
                                    )
                                  )
                                }
                                className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-center font-mono font-bold text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  saveStockToSupabase(
                                    item.id,
                                    item.stock
                                  )
                                }
                                disabled={
                                  isSaving
                                }
                                title="Guardar nuevo stock"
                                className="cursor-pointer rounded-lg border border-cyan-400/30 bg-cyan-600 p-1.5 text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-800"
                              >
                                {isSaving ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* ESTADO */}

                          <td className="px-6 py-4 text-center font-mono text-xs">

                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 font-bold text-red-400">
                                <AlertCircle className="h-3 w-3" />
                                Agotado
                              </span>
                            ) : isLowStock ? (
                              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-bold text-amber-400">
                                Poco Stock
                              </span>
                            ) : (
                              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-bold text-emerald-400">
                                Disponible
                              </span>
                            )}
                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          INFORMACIÓN
      ======================================================== */}

      {!loading && (
        <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono">
            Mostrando{" "}
            <strong className="text-slate-300">
              {filteredProducts.length}
            </strong>{" "}
            de{" "}
            <strong className="text-slate-300">
              {products.length}
            </strong>{" "}
            productos.
          </span>

          <span className="font-mono">
            Los pedidos cancelados no se
            contabilizan en &quot;En Pedidos&quot;.
          </span>
        </div>
      )}
    </div>
  );
}