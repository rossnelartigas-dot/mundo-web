import Link from "next/link";
import { getProducts } from "@/services/productService";

interface Props {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function CategoriasPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q?.trim().toLowerCase() || "";

  type ProductType = Awaited<ReturnType<typeof getProducts>>[number];

  let products: ProductType[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Error al cargar productos para categorías:", error);
    products = [];
  }

  // Filtrar categorías únicas y limpiar valores nulos o vacíos
  const allCategories = Array.from(
    new Set(
      products
        .map((product) => product.category)
        .filter((cat): cat is string => Boolean(cat) && cat.trim() !== "")
    )
  ).sort();

  // Filtrar categorías según el término de búsqueda introducido
  const filteredCategories = allCategories.filter((category) =>
    category.toLowerCase().includes(query)
  );

  return (
    <main className="min-h-screen bg-slate-950 py-12 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ENLACE DE REGRESO Y ENCABEZADO */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono transition-all backdrop-blur-md w-fit"
          >
            ← Volver al inicio
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                Explorar Categorías
              </h1>
              <p className="mt-1 text-xs text-slate-400 font-mono">
                Filtra el catálogo e inventario global por sectores tecnológicos.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-mono text-cyan-400 w-fit">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1 ? "categoría encontrada" : "categorías encontradas"}
            </div>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA DE CATEGORÍAS */}
        <form
          method="GET"
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Buscar categoría (ej. Cámaras, Servidores, Laptops...)"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>

            <div className="flex w-full sm:w-auto gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-mono font-bold text-slate-950 transition hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                Buscar
              </button>

              {query && (
                <Link
                  href="/categorias"
                  className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-center text-xs font-mono text-slate-400 hover:bg-slate-900 hover:text-white transition"
                >
                  Limpiar
                </Link>
              )}
            </div>
          </div>
        </form>

        {/* GRILLA DE CATEGORÍAS */}
        {filteredCategories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => {
              const categoryProducts = products.filter(
                (product) => product.category === category
              );
              const totalItems = categoryProducts.length;

              return (
                <Link
                  key={category}
                  href={`/productos?categoria=${encodeURIComponent(category)}`}
                  className="group relative block rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {category}
                    </h2>

                    <span className="shrink-0 bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[10px] uppercase px-2.5 py-1 rounded-lg">
                      Sector
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 font-semibold">
                      {totalItems}
                    </span>{" "}
                    {totalItems === 1 ? "producto registrado" : "productos registrados"}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <span className="text-xs font-mono text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Ver catálogo →
                    </span>

                    <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
                      MUNDO STORE
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* ESTADO SIN RESULTADOS */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-12 text-center shadow-2xl space-y-3">
            <p className="font-mono text-sm font-semibold text-rose-400">
              [!] No se encontraron categorías
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {query
                ? `No hay categorías que coincidan con la búsqueda "${query}".`
                : "Aún no hay productos categorizados en el sistema o la base de datos se encuentra vacía."}
            </p>
            {query && (
              <Link
                href="/categorias"
                className="inline-block mt-4 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-mono font-bold text-slate-950 hover:bg-cyan-400 transition"
              >
                Ver todas las categorías
              </Link>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
