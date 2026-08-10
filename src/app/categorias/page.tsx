import Link from "next/link";
import { getProducts } from "@/services/productService";

export default async function CategoriasPage() {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map((product) => product.category)));

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="mb-4 inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700">
          ← Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Categorías</h1>
        <p className="mt-2 text-slate-600">Encuentra productos por categoría.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div key={category} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">{category}</h2>
              <p className="mt-2 text-sm text-slate-500">
                {products.filter((product) => product.category === category).length} productos
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
