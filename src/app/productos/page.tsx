import Link from "next/link";
import { getProducts } from "@/services/productService";

export default async function ProductosPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="mb-4 inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700">
          ← Volver al inicio
        </a>
        <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
        <p className="mt-2 text-slate-600">Explora todos los productos disponibles en la tienda.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-slate-800">{product.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{product.brand}</p>
              <p className="mt-4 text-cyan-600 font-semibold">${product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
