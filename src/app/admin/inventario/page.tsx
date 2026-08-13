import { supabase } from "@/lib/supabase";
import Image from "next/image";

export const revalidate = 0; // Para asegurar que siempre traiga el stock en tiempo real

export default async function InventoryPage() {
  // Consultamos los productos con su stock actualizado
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, image, price, stock")
    .order("stock", { ascending: true }); // Muestra primero los de menor stock

  if (error) {
    return (
      <div className="p-6 text-red-400 font-mono">
        Error al cargar el inventario real.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Inventario en Tiempo Real
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Existencias reales descontadas automáticamente con cada pedido.
        </p>
      </div>

      {/* Tabla de Inventario */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/90 text-cyan-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4 text-center">Precio</th>
              <th className="px-6 py-4 text-center">Stock Disponible</th>
              <th className="px-6 py-4 text-center">Estado</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {products?.map((item) => {
              const stock = item.stock ?? 0;
              const isOutOfStock = stock <= 0;
              const isLowStock = stock > 0 && stock <= 3;

              return (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Nombre e Imagen */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shrink-0">
                      <Image
                        src={item.image || "/no-image.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-semibold text-white">{item.name}</span>
                  </td>

                  {/* Precio */}
                  <td className="px-6 py-4 text-center font-mono text-slate-400">
                    ${Number(item.price).toFixed(2)}
                  </td>

                  {/* Stock Real */}
                  <td className="px-6 py-4 text-center font-mono font-bold text-base">
                    <span
                      className={
                        isOutOfStock
                          ? "text-red-400"
                          : isLowStock
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }
                    >
                      {stock} {stock === 1 ? "unidad" : "unidades"}
                    </span>
                  </td>

                  {/* Insignia / Status */}
                  <td className="px-6 py-4 text-center font-mono text-xs">
                    {isOutOfStock ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
                        Agotado
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}