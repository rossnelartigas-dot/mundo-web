import Link from "next/link";
import Image from "next/image";

import { Product } from "@/types/product";
import { getProducts } from "@/services/productService";

import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Error loading products:", error);
    products = [];
  }

  return (
    <div className="space-y-8 text-slate-100">
      {/* Encabezado con Botón de Acción Principal */}
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

      {/* Contenedor vidriado con tabla cibernética */}
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
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* Imagen del Producto */}
                  <td className="p-4">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover rounded-xl border border-slate-700/80 bg-slate-950 w-16 h-16"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-[10px] font-mono text-slate-500">
                        Sin imagen
                      </div>
                    )}
                  </td>

                  {/* Nombre y Marca */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-100">
                      {product.name}
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">
                      {product.brand || "Sin marca"}
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="p-4 text-center font-mono text-xs text-slate-400">
                    {product.sku || "-"}
                  </td>

                  {/* Precio */}
                  <td className="p-4 text-center font-mono font-semibold text-emerald-400">
                    ${Number(product.price).toFixed(2)}
                  </td>

                  {/* Stock */}
                  <td className="p-4 text-center font-mono font-medium text-slate-300">
                    {product.stock}
                  </td>

                  {/* Estado (Activo / Inactivo) */}
                  <td className="p-4 text-center">
                    {product.active ? (
                      <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-block bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider">
                        Inactivo
                      </span>
                    )}
                  </td>

                  {/* Destacado */}
                  <td className="p-4 text-center font-mono text-xs">
                    {product.featured ? (
                      <span className="text-cyan-400 font-bold">Sí</span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
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

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center font-mono text-xs text-slate-500"
                  >
                    No se encontraron productos en la base de datos.
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
