import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/services/productService";

interface Props {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    marca?: string;
    orden?: string;
    ofertas?: string;
  }>;
}

export default async function ProductosPage({
  searchParams,
}: Props) {
  const products = await getProducts();

  const params = await searchParams;

  const query = params.q?.trim().toLowerCase() || "";
  const category = params.categoria?.trim() || "";
  const brand = params.marca?.trim() || "";
  const order = params.orden?.trim() || "recientes";
  const onlyOffers = params.ofertas === "true";

  const categories = Array.from(
    new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    )
  ).sort();

  const brands = Array.from(
    new Set(
      products
        .map((product) => product.brand)
        .filter(Boolean)
    )
  ).sort();

  let filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const productBrand = product.brand?.trim() || "";
    const productCategory = product.category?.toLowerCase() || "";
    const sku = (product as { sku?: string }).sku?.toLowerCase() || "";

    // Detección de ofertas flexible según los campos comunes de la BD
    const p = product as { 
      is_offer?: boolean; 
      on_sale?: boolean; 
      discount_price?: number; 
      original_price?: number; 
    };
    const isOffer = 
      Boolean(p.is_offer) || 
      Boolean(p.on_sale) || 
      (p.discount_price ? p.discount_price < product.price : false) ||
      (p.original_price ? p.original_price > product.price : false);

    const matchesSearch =
      !query ||
      name.includes(query) ||
      productBrand.toLowerCase().includes(query) ||
      productCategory.includes(query) ||
      sku.includes(query);

    const matchesCategory =
      !category ||
      product.category === category;

    const matchesBrand =
      !brand ||
      productBrand === brand;

    const matchesOffers = !onlyOffers || isOffer;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesOffers
    );
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (order) {
      case "precio-menor":
        return a.price - b.price;

      case "precio-mayor":
        return b.price - a.price;

      case "nombre-az":
        return a.name.localeCompare(b.name);

      case "nombre-za":
        return b.name.localeCompare(a.name);

      case "recientes":
      default:
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
    }
  });

  const hasFilters =
    query ||
    category ||
    brand ||
    onlyOffers ||
    order !== "recientes";

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ENLACE DE REGRESO Y TÍTULO */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono transition-all backdrop-blur-md w-fit"
          >
            ← Volver al inicio
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
            Productos
          </h1>

          <p className="mt-2 text-xs font-mono text-slate-400">
            Explora todos los productos disponibles en la tienda.
          </p>
        </div>

        {/* FILTROS Y BÚSQUEDA */}
        <form
          method="GET"
          className="
            mt-8
            rounded-2xl
            border
            border-slate-800
            bg-slate-900/80
            p-5
            shadow-xl
            backdrop-blur-md
            space-y-4
          "
        >
          {/* BARRA DE BÚSQUEDA POR NOMBRE / SKU */}
          <div>
            <label
              htmlFor="q"
              className="mb-2 block text-xs font-mono text-slate-300"
            >
              Buscar producto por nombre o modelo
            </label>
            <div className="relative">
              <input
                type="text"
                id="q"
                name="q"
                defaultValue={query}
                placeholder="Ej. Cámara IP, Mini PC, Monitor..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-950
                  px-4
                  py-2.5
                  text-sm
                  text-slate-200
                  placeholder-slate-500
                  outline-none
                  focus:border-cyan-500
                  focus:ring-1
                  focus:ring-cyan-500
                "
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* CATEGORÍA */}
            <div>
              <label
                htmlFor="categoria"
                className="mb-2 block text-xs font-mono text-slate-300"
              >
                Categoría
              </label>

              <select
                id="categoria"
                name="categoria"
                defaultValue={category}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-950
                  px-3
                  py-2.5
                  text-sm
                  text-slate-200
                  outline-none
                  focus:border-cyan-500
                  focus:ring-1
                  focus:ring-cyan-500
                "
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
              <label
                htmlFor="marca"
                className="mb-2 block text-xs font-mono text-slate-300"
              >
                Marca
              </label>

              <select
                id="marca"
                name="marca"
                defaultValue={brand}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-950
                  px-3
                  py-2.5
                  text-sm
                  text-slate-200
                  outline-none
                  focus:border-cyan-500
                  focus:ring-1
                  focus:ring-cyan-500
                "
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
              <label
                htmlFor="orden"
                className="mb-2 block text-xs font-mono text-slate-300"
              >
                Ordenar por
              </label>

              <select
                id="orden"
                name="orden"
                defaultValue={order}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-950
                  px-3
                  py-2.5
                  text-sm
                  text-slate-200
                  outline-none
                  focus:border-cyan-500
                  focus:ring-1
                  focus:ring-cyan-500
                "
              >
                <option value="recientes">Más recientes</option>
                <option value="precio-menor">Precio: menor a mayor</option>
                <option value="precio-mayor">Precio: mayor a menor</option>
                <option value="nombre-az">Nombre: A-Z</option>
                <option value="nombre-za">Nombre: Z-A</option>
              </select>
            </div>
          </div>

          {/* OPCIÓN DE OFERTAS Y BOTONES */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300 select-none">
              <input
                type="checkbox"
                name="ofertas"
                value="true"
                defaultChecked={onlyOffers}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-amber-400 font-bold">🔥 Ver solo productos en oferta</span>
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="
                  rounded-xl
                  bg-cyan-500
                  px-5
                  py-2.5
                  text-xs
                  font-mono
                  font-bold
                  text-slate-950
                  transition
                  hover:bg-cyan-400
                  shadow-[0_0_15px_rgba(6,182,212,0.3)]
                "
              >
                Buscar / Aplicar
              </button>

              {hasFilters && (
                <Link
                  href="/productos"
                  className="
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-950
                    px-5
                    py-2.5
                    text-xs
                    font-mono
                    text-slate-400
                    transition
                    hover:bg-slate-900
                    hover:text-white
                  "
                >
                  Limpiar filtros
                </Link>
              )}
            </div>
          </div>
        </form>

        {/* INFORMACIÓN DE FILTROS ACTIVOS */}
        {(query || category || brand || onlyOffers) && (
          <div className="flex flex-wrap gap-3 text-xs font-mono text-slate-400 pt-2">
            {query && (
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                Búsqueda: <strong className="text-cyan-400">&quot;{query}&quot;</strong>
              </span>
            )}
            {category && (
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                Categoría: <strong className="text-cyan-400">{category}</strong>
              </span>
            )}
            {brand && (
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                Marca: <strong className="text-cyan-400">{brand}</strong>
              </span>
            )}
            {onlyOffers && (
              <span className="bg-slate-900 border border-amber-500/30 px-3 py-1 rounded-lg text-amber-400">
                🔥 Solo Ofertas
              </span>
            )}
          </div>
        )}

        {/* RESULTADOS */}
        {filteredProducts.length === 0 ? (
          <div
            className="
              mt-10
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/80
              p-10
              text-center
              shadow-2xl
              backdrop-blur-md
            "
          >
            <h2 className="text-lg font-bold text-rose-400 font-mono">
              [!] No se encontraron productos
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Intenta cambiar los filtros o realizar otra búsqueda.
            </p>

            <Link
              href="/productos"
              className="
                mt-6
                inline-block
                rounded-xl
                bg-cyan-500
                px-5
                py-2.5
                text-xs
                font-mono
                font-bold
                text-slate-950
                transition
                hover:bg-cyan-400
              "
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-6 text-xs font-mono text-slate-400">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "producto encontrado"
                : "productos encontrados"}
            </p>

            <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const imageUrl = (product as { image_url?: string; image?: string }).image_url || product.image;

                return (
                  <Link
                    key={product.id}
                    href={`/productos/${product.slug}`}
                    className="
                      group
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
                      hover:border-cyan-500/50
                      hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]
                    "
                  >
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

                    <div className="flex flex-1 flex-col justify-between space-y-3">
                      <div>
                        <h2 className="text-base font-bold text-white transition group-hover:text-cyan-400">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-xs font-mono text-slate-400">
                          {product.brand}
                        </p>

                        <p className="mt-0.5 text-[11px] font-mono text-slate-500">
                          {product.category}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <p className="text-lg font-extrabold text-cyan-400 font-mono">
                          ${product.price}
                        </p>

                        <span className="text-[10px] font-mono text-cyan-500/80 group-hover:translate-x-1 transition-transform">
                          Ver detalle →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
