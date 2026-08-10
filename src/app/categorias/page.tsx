import Link from "next/link";
import { getProducts } from "@/services/productService";

export default async function CategoriasPage() {
  const products = await getProducts();

  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Link
          href="/"
          className="text-sm text-cyan-600 hover:text-cyan-700"
        >
          ← Volver al inicio
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Categorías
        </h1>

        <p className="mt-2 text-slate-600">
          Encuentra productos por categoría.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/productos?categoria=${encodeURIComponent(category)}`}
              className="
                block
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:-translate-y-1
                hover:shadow-md
                hover:border-cyan-300
              "
            >
              <h2 className="text-lg font-semibold text-slate-800">
                {category}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {
                  products.filter(
                    (product) => product.category === category
                  ).length
                }{" "}
                productos
              </p>

              <p className="mt-4 text-sm font-medium text-cyan-600">
                Ver productos →
              </p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}