import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/services/productService";

interface Props {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    marca?: string;
    orden?: string;
  }>;
}

export default async function OfertasPage({ searchParams }: Props) {
  const params = await searchParams;

  const query = params.q?.trim().toLowerCase() || "";
  const category = params.categoria?.trim() || "";
  const brand = params.marca?.trim() || "";
  const order = params.orden?.trim() || "descuento-mayor";

  const products = await getProducts();

  // 1. Filtrar solo productos que estén verdaderamente en oferta
  const allOffers = products.filter((product) => {
    const p = product as { 
      discount?: number; 
      is_offer?: boolean; 
      on_sale?: boolean; 
      discount_price?: number; 
    };

    const hasPercentageDiscount = typeof p.discount === "number" && p.discount > 0;
    const hasDiscountPrice = typeof p.discount_price === "number" && p.discount_price < product.price;
    const isFlaggedOffer = Boolean(p.is_offer) || Boolean(p.on_sale);

    return hasPercentageDiscount || hasDiscountPrice || isFlaggedOffer;
  });

  // Categorías y Marcas únicas dentro del universo de Ofertas
  const categories = Array.from(
    new Set(allOffers.map((p) => p.category).filter(Boolean))
  ).sort();

  const brands = Array.from(
    new Set(allOffers.map((p) => p.brand).filter(Boolean))
  ).sort();

  // 2. Aplicar búsquedas y filtros sobre las ofertas
  let filteredOffers = allOffers.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const productBrand = product.brand?.trim() || "";
    const productCategory = product.category?.toLowerCase() || "";
    const sku = (product as { sku?: string }).sku?.toLowerCase() || "";

    const matchesSearch =
      !query ||
      name.includes(query) ||
      productBrand.toLowerCase().includes(query) ||
      productCategory.includes(query) ||
      sku.includes(query);

    const matchesCategory = !category || product.category === category;
    const matchesBrand = !brand || productBrand === brand;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  // 3. Ordenar resultados
  filteredOffers = [...filteredOffers].sort((a, b) => {
    const aDiscount = a.discount || 0;
    const bDiscount = b.discount || 0;

    switch (order) {
      case "precio-menor":
        return a.price - b.price;

      case "precio-mayor":
        return b.price - a.price;

      case "descuento-mayor":
      default:
        return bDiscount - aDiscount;
    }
  });

  const hasFilters = query || category || brand || order !== "descuento-mayor";

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* ENCABEZADO */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono transition-all backdrop-blur-md w-fit"
          >
            ← Volver al inicio
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                🔥 Ofertas Especiales
              </h1>
              <p className="mt-1 text-xs font-mono text-slate-400">
                Productos con precio rebajado o descuento exclusivo por tiempo limitado.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-rose-950/40 border border-rose-900/50 px-3.5 py-1.5 rounded-full text-xs font-mono text-rose-400 w-fit backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              {filteredOffers.length}{" "}
              {filteredOffers.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
            </div>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS DE OFERTAS */}
        <form
          method="GET"
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4"
        >
          {/* BUSCADOR */}
          <div>
            <label htmlFor="q" className="mb-2 block text-xs font-mono text-slate-300">
              Buscar en ofertas por nombre o modelo
            </label>
            <input
              type="text"
              id="q"
              name="q"
              defaultValue={query}
              placeholder="Ej. Cámara, Monitor, PC..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* CATEGORÍA */}
            <div>
              <label htmlFor="categoria" className="mb-2 block text-xs font-mono text-slate-300">
                Categoría
              </label>
              <select
                id="categoria"
                name="categoria"
                defaultValue={category}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* MARCA */}
            <div>
              <label htmlFor="marca" className="mb-2 block text-xs font-mono text-slate-300">
                Marca
              </label>
              <select
                id="marca"
                name="marca"
                defaultValue={brand}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              >
                <option value="">Todas las marcas</option>
                {brands.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* ORDENAR */}
            <div>
              <label htmlFor="orden" className="mb-2 block text-xs font-mono text-slate-300">
                Ordenar por
              </label>
              <select
                id="orden"
                name="orden"
                defaultValue={order}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              >
                <option value="descuento-mayor">Mayor descuento %</option>
                <option value="precio-menor">Precio: menor a mayor</option>
                <option value="precio-mayor">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-rose-500 px-5 py-2.5 text-xs font-mono font-bold text-white transition hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            >
              Filtrar ofertas
            </button>

            {hasFilters && (
              <Link
                href="/ofertas"
                className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-xs font-mono text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                Limpiar filtros
              </Link>
            )}
          </div>
        </form>

        {/* ETIQUETAS DE FILTROS ACTIVOS */}
        {(query || category || brand) && (
          <div className="flex flex-wrap gap-3 text-xs font-mono text-slate-400 pt-1">
            {query && (
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                Búsqueda: <strong className="text-rose-400">&quot;{query}&quot;</strong>
              </span>
            )}
            {category && (
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                Categoría: <strong className="text-rose-400">{category}</strong>
              </span>
            )}
            {brand && (
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                Marca: <strong className="text-rose-400">{brand}</strong>
              </span>
            )}
          </div>
        )}

        {/* GRILLA DE RESULTADOS DE OFERTAS */}
        {filteredOffers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center shadow-2xl backdrop-blur-md space-y-3">
            <p className="font-mono text-sm font-semibold text-rose-400">
              [!] No se encontraron ofertas con los filtros aplicados
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {allOffers.length === 0
                ? "Aún no hay productos etiquetados en oferta en la tienda."
                : "Prueba modificando los términos de búsqueda o limpiando los filtros."}
            </p>
            <Link
              href="/productos"
              className="mt-4 inline-block rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-mono font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Ver catálogo completo
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((product) => {
              const p = product as { 
                discount?: number; 
                discount_price?: number; 
                image_url?: string; 
                image?: string; 
              };

              // Cálculo inteligente del descuento e importes
              const hasPercentage = typeof p.discount === "number" && p.discount > 0;
              const hasDiscountPrice = typeof p.discount_price === "number" && p.discount_price < product.price;

              let finalPrice = product.price;
              const originalPrice = product.price;
              let discountPercent = p.discount || 0;

              if (hasPercentage) {
                finalPrice = product.price - (product.price * p.discount!) / 100;
              } else if (hasDiscountPrice) {
                finalPrice = p.discount_price!;
                discountPercent = Math.round(((product.price - p.discount_price!) / product.price) * 100);
              }

              const imageUrl = p.image_url || p.image;

              return (
                <Link
                  key={product.id}
                  href={`/productos/${product.slug}`}
                  className="
                    group
                    relative
                    flex
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900/80
                    p-5
                    shadow-xl
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-rose-500/50
                    hover:shadow-[0_0_25px_rgba(244,63,94,0.15)]
                  "
                >
                  {/* BADGE DE DESCUENTO */}
                  {discountPercent > 0 && (
                    <div className="absolute top-8 right-8 z-10 rounded-lg bg-rose-500 px-2.5 py-1 text-[11px] font-mono font-bold text-white shadow-lg animate-pulse">
                      -{discountPercent}% OFF
                    </div>
                  )}

                  {/* CONTENEDOR DE IMAGEN */}
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-[10px] text-slate-600">
                        [ SIN IMAGEN ]
                      </div>
                    )}
                  </div>

                  {/* INFORMACIÓN Y PRECIOS */}
                  <div className="flex flex-1 flex-col justify-between space-y-3">
                    <div>
                      <h2 className="text-base font-bold text-white transition group-hover:text-rose-400">
                        {product.name}
                      </h2>

                      <p className="mt-1 text-xs font-mono text-slate-400">
                        {product.brand}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-rose-400 font-mono">
                          ${Number(finalPrice).toFixed(2)}
                        </span>
                        {discountPercent > 0 && (
                          <span className="text-xs font-mono text-slate-500 line-through">
                            ${Number(originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-rose-400/80 group-hover:translate-x-1 transition-transform">
                        Ver detalle →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
