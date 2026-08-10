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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <p className="mt-2 text-slate-500">
          Sección funcional de categorías basada en los productos cargados.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-500">Categorías encontradas</p>
          <h2 className="text-4xl font-bold mt-3">{totalCategories}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-500">Productos totales</p>
          <h2 className="text-4xl font-bold mt-3">{totalProducts}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-500">Categoría con más productos</p>
          <h2 className="text-4xl font-bold mt-3">
            {topCategory ? topCategory.name : "-"}
          </h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl shadow bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold">Resumen por categoría</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Productos</th>
                <th className="px-4 py-3">Ingresos</th>
                <th className="px-4 py-3">Último producto</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.name} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-semibold">{category.name}</td>
                  <td className="px-4 py-3">{category.count}</td>
                  <td className="px-4 py-3">${category.revenue.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {category.lastProductAt
                      ? new Date(category.lastProductAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
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
