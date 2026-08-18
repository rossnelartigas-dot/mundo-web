"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { getProducts } from "@/services/productService";
import DeleteButton from "@/components/admin/DeleteButton";
import { toggleProductField } from "@/app/actions/productActions";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Cargar productos al montar
  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  // Cambiar estado o destacado directamente en Supabase
  const handleToggle = async (id: string | number, field: "active" | "featured", currentValue: boolean) => {
    // Cambia visualmente de inmediato
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !currentValue } : p))
    );
    // Guarda en Supabase
    await toggleProductField(id, field, currentValue);
  };

  // Filtrado de productos en pantalla
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && p.active) ||
      (statusFilter === "inactive" && !p.active);

    const matchesFeatured =
      featuredFilter === "all" ||
      (featuredFilter === "featured" && p.featured) ||
      (featuredFilter === "not_featured" && !p.featured);

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  return (
    <div className="space-y-8 text-slate-100">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Productos
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Catálogo global de artículos e inventario de la tienda.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          + Nuevo Producto
        </Link>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <input
          type="text"
          placeholder="Buscar por nombre, SKU o marca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl text-xs font-mono outline-none focus:border-cyan-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl text-xs font-mono outline-none cursor-pointer"
        >
          <option value="all">Todos los Estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>

        <select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-xl text-xs font-mono outline-none cursor-pointer"
        >
          <option value="all">Todos (Destacados y No)</option>
          <option value="featured">Solo Destacados</option>
          <option value="not_featured">No Destacados</option>
        </select>
      </div>

      {/* Tabla cibernética */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-cyan-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 text-left">Imagen</th>
                <th className="p-4 text-left">Producto</th>
                <th className="p-4 text-center">SKU</th>
                <th className="p-4 text-center">Precio</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Destacado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Imagen */}
                  <td className="p-4">
                    <div className="relative w-12 h-12 min-w-[48px] rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                      <Image
                        src={
                          (Array.isArray(product.image)
                            ? product.image[0]
                            : typeof product.image === "string"
                            ? product.image
                            : product.image_url) || "/no-image.png"
                        }
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </td>

                  {/* Nombre y Marca */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-100">{product.name}</div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">{product.brand || "Sin marca"}</div>
                  </td>

                  {/* SKU */}
                  <td className="p-4 text-center font-mono text-xs text-slate-400">{product.sku || "-"}</td>

                  {/* Precio */}
                  <td className="p-4 text-center font-mono font-semibold text-emerald-400">
                    ${Number(product.price).toFixed(2)}
                  </td>

                  {/* Stock */}
                  <td className="p-4 text-center font-mono font-medium text-slate-300">{product.stock}</td>

                  {/* Estado (Clic para cambiar directo) */}
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(product.id, "active", product.active)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border cursor-pointer transition-all ${
                        product.active
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                      }`}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>

                  {/* Destacado (Clic para cambiar directo) */}
                  <td className="p-4 text-center font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggle(product.id, "featured", product.featured)}
                      className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all border ${
                        product.featured
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20"
                          : "bg-slate-800/60 text-slate-500 border-slate-700 hover:text-slate-300"
                      }`}
                    >
                      {product.featured ? "Sí ★" : "No"}
                    </button>
                  </td>

                  {/* Acciones */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-block bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-mono transition-all"
                      >
                        Editar
                      </Link>
                      <DeleteButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center font-mono text-xs text-slate-500">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}