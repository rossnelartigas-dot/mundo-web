import { getProducts } from "@/services/productService";

export default async function OfertasPage() {
  const products = await getProducts();
  const offers = products.filter((product) => product.discount > 0);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="mb-4 inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700">
          ← Volver al inicio
        </a>
        <h1 className="text-3xl font-bold text-slate-900">Ofertas</h1>
        <p className="mt-2 text-slate-600">Productos con descuento disponibles ahora.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {offers.map((product) => (
            <div key={product.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">{product.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{product.brand}</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-cyan-600 font-semibold">${product.price - (product.price * product.discount) / 100}</span>
                <span className="text-sm text-gray-400 line-through">${product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
