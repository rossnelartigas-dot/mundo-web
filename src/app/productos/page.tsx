import Link from "next/link";
import { getProducts } from "@/services/productService";

interface Props {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function ProductosPage({
  searchParams,
}: Props) {
  const products = await getProducts();

  const params = await searchParams;

  const query = params.q?.trim().toLowerCase() || "";

  const filteredProducts = query
    ? products.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const brand = product.brand?.toLowerCase() || "";

        return (
          name.includes(query) ||
          brand.includes(query)
        );
      })
    : products;

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
          Productos
        </h1>

        <p className="mt-2 text-slate-600">
          Explora todos los productos disponibles en la tienda.
        </p>

        {query && (
          <p className="mt-4 text-sm text-slate-500">
  Resultados para:{" "}
  <span className="font-semibold text-slate-700">
    &quot;{query}&quot;
  </span>
</p>
        )}

        {filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">
              No se encontraron productos
            </h2>

            <p className="mt-2 text-slate-500">
              Intenta buscar con otro nombre o marca.
            </p>

            <Link
              href="/productos"
              className="mt-6 inline-block rounded-lg bg-cyan-500 px-5 py-2.5 font-medium text-white transition hover:bg-cyan-600"
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/productos/${product.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-slate-800">
                  {product.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {product.brand}
                </p>

                <p className="mt-4 font-semibold text-cyan-600">
                  ${product.price}
                </p>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}