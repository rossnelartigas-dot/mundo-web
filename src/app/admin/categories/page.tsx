import { getProducts } from "@/services/productService";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Error loading categories data:", error);
    products = [];
  }

  const categoryMap = new Map<string, {
    name: string;
    count: number;
    revenue: number;
    lastProductAt: string;
  }>();

  products.forEach((product: Product) => {
    const category = product.category || "Sin categoría";
    const existing = categoryMap.get(category);
    const createdAt = product.created_at ? new Date(product.created_at).toISOString() : "";

    if (existing) {
      categoryMap.set(category, {
        ...existing,
        count: existing.count + 1,
        revenue: existing.revenue + Number(product.price ?? 0),
        lastProductAt: existing.lastProductAt > createdAt ? existing.lastProductAt : createdAt,
      });
    } else {
      categoryMap.set(category, {
        name: category,
        count: 1,
        revenue: Number(product.price ?? 0),
        lastProductAt: createdAt,
      });
    }
  });

  const categories = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
  const totalCategories = categories.length;
  const totalProducts = products.length;
  const topCategory = categories[0];

  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Categorías
        </h1>
        <p className="mt-1 text-xs text-slate-400 font-mono">
          Sección funcional de categorías basada en los productos cargados.
        </p>
      </div>

      {/* Tarjetas de Métricas Neón */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Categorías encontradas
          </p>
          <h2 className="text-4xl font-extrabold font-mono text-cyan-400 mt-2">
            {totalCategories}
          </h2>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Productos totales
          </p>
          <h2 className="text-4xl font-extrabold font-mono text-cyan-400 mt-2">
            {totalProducts}
          </h2>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Categoría con más productos
          </p>
          <h2 className="text-3xl font-bold font-mono text-cyan-400 mt-2 truncate">
            {topCategory ? topCategory.name : "-"}
          </h2>
        </div>
      </div>

      {/* Tabla Cibernética de Categorías */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl">
        <div className="border-b border-slate-800 px-6 py-4 bg-slate-950/40">
          <h2 className="text-base font-bold text-white font-mono tracking-wide">
            Resumen por categoría
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-cyan-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Categoría</th>
                <th className="px-6 py-3.5">Productos</th>
                <th className="px-6 py-3.5">Ingresos</th>
                <th className="px-6 py-3.5">Último producto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {categories.map((category) => (
                <tr 
                  key={category.name} 
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-slate-100">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-cyan-400">
                    {category.count}
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-emerald-400">
                    ${category.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    {category.lastProductAt
                      ? new Date(category.lastProductAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td 
                    colSpan={4} 
                    className="px-6 py-8 text-center text-slate-500 font-mono text-xs"
                  >
                    No se encontraron categorías.
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