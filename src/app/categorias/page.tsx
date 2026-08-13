import Link from "next/link";
import { getProducts } from "@/services/productService";

export default async function CategoriasPage() {
  // Obtenemos el tipo directamente del retorno de la función
  type ProductType = Awaited<ReturnType<typeof getProducts>>[number];
  
  let products: ProductType[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Error al cargar productos para categorías:", error);
    products = [];
  }

  // Filtrar categorías únicas y limpiar valores nulos o vacíos
  const categories = Array.from(
    new Set(
      products
        .map((product) => product.category)
        .filter((cat): cat is string => Boolean(cat) && cat.trim() !== "")
    )
  );

  return (
    <main className="min-h-screen bg-slate-950 py-12 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Enlace de regreso y Encabezado */}
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
              {categories.length} {categories.length === 1 ? "categoría" : "categorías"}
            </div>
          </div>
        </div>

        {/* Grilla de Categorías */}
        {categories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
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
          /* Estado sin categorías */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-12 text-center shadow-2xl space-y-3">
            <p className="font-mono text-sm font-semibold text-rose-400">
              [!] Sin categorías disponibles
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Aún no hay productos categorizados en el sistema o la base de datos se encuentra vacía.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}