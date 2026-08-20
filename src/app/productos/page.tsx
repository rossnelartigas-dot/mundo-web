import Link from "next/link";
import Image from "next/image";

import { getProducts } from "@/services/productService";
import AddToCartButton from "@/components/AddToCartButton";

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
    const productCategory =
      product.category?.toLowerCase() || "";
    const sku =
      (product as { sku?: string }).sku?.toLowerCase() || "";

    // Detección flexible de ofertas
    const p = product as {
      is_offer?: boolean;
      on_sale?: boolean;
      discount_price?: number;
      original_price?: number;
    };

    const isOffer =
      Boolean(p.is_offer) ||
      Boolean(p.on_sale) ||
      (p.discount_price
        ? p.discount_price < product.price
        : false) ||
      (p.original_price
        ? p.original_price > product.price
        : false);

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

    const matchesOffers =
      !onlyOffers || isOffer;

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
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
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

        {/* =====================================================
            ENCABEZADO
        ===================================================== */}

        <div>
          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-800
              bg-slate-900/80
              px-4
              py-2
              text-xs
              font-mono
              text-slate-400
              backdrop-blur-md
              transition-all
              hover:bg-slate-800
              hover:text-white
            "
          >
            ← Volver al inicio
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Productos
          </h1>

          <p className="mt-2 text-xs font-mono text-slate-400">
            Explora todos los productos disponibles en la tienda.
          </p>
        </div>

        {/* =====================================================
            FILTROS
        ===================================================== */}

        <form
          method="GET"
          className="
            mt-8
            space-y-4
            rounded-2xl
            border
            border-slate-800
            bg-slate-900/80
            p-5
            shadow-xl
            backdrop-blur-md
          "
        >
          {/* BÚSQUEDA */}

          <div>
            <label
              htmlFor="q"
              className="mb-2 block text-xs font-mono text-slate-300"
            >
              Buscar producto por nombre o modelo
            </label>

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

          {/* FILTROS */}

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
                <option value="">
                  Todas las categorías
                </option>

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
                <option value="">
                  Todas las marcas
                </option>

                {brands.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* ORDEN */}

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
                <option value="recientes">
                  Más recientes
                </option>

                <option value="precio-menor">
                  Precio: menor a mayor
                </option>

                <option value="precio-mayor">
                  Precio: mayor a menor
                </option>

                <option value="nombre-az">
                  Nombre: A-Z
                </option>

                <option value="nombre-za">
                  Nombre: Z-A
                </option>
              </select>
            </div>
          </div>

          {/* OFERTAS */}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">

            <label className="inline-flex cursor-pointer select-none items-center gap-2 text-xs font-mono text-slate-300">
              <input
                type="checkbox"
                name="ofertas"
                value="true"
                defaultChecked={onlyOffers}
                className="
                  h-4
                  w-4
                  rounded
                  border-slate-800
                  bg-slate-950
                  text-cyan-500
                  focus:ring-cyan-500
                "
              />

              <span className="font-bold text-amber-400">
                🔥 Ver solo productos en oferta
              </span>
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
                  shadow-[0_0_15px_rgba(6,182,212,0.3)]
                  transition
                  hover:bg-cyan-400
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

        {/* =====================================================
            FILTROS ACTIVOS
        ===================================================== */}

        {(query || category || brand || onlyOffers) && (
          <div className="flex flex-wrap gap-3 pt-2 text-xs font-mono text-slate-400">

            {query && (
              <span className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1">
                Búsqueda:{" "}
                <strong className="text-cyan-400">
                  &quot;{query}&quot;
                </strong>
              </span>
            )}

            {category && (
              <span className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1">
                Categoría:{" "}
                <strong className="text-cyan-400">
                  {category}
                </strong>
              </span>
            )}

            {brand && (
              <span className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1">
                Marca:{" "}
                <strong className="text-cyan-400">
                  {brand}
                </strong>
              </span>
            )}

            {onlyOffers && (
              <span className="rounded-lg border border-amber-500/30 bg-slate-900 px-3 py-1 text-amber-400">
                🔥 Solo Ofertas
              </span>
            )}
          </div>
        )}

        {/* =====================================================
            RESULTADOS
        ===================================================== */}

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
            <h2 className="font-mono text-lg font-bold text-rose-400">
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

            {/* =================================================
                GRID DE PRODUCTOS
            ================================================= */}

            <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredProducts.map((product) => {

                const imageUrl =
                  (product as {
                    image_url?: string;
                    image?: string;
                  }).image_url ||
                  product.image;

                const stock = Number(product.stock) || 0;

                const available = stock > 0;

                return (
                  <article
                    key={product.id}
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

                    {/* =========================================
                        IMAGEN
                    ========================================= */}

                    <Link
                      href={`/productos/${product.slug}`}
                      className="block"
                    >
                      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950">

                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="
                              object-contain
                              p-4
                              transition-transform
                              duration-300
                              group-hover:scale-105
                            "
                            sizes="
                              (max-width: 768px) 100vw,
                              (max-width: 1200px) 50vw,
                              33vw
                            "
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] text-slate-600">
                            [ SIN IMAGEN ]
                          </div>
                        )}

                        {/* ESTADO DE STOCK SOBRE LA IMAGEN */}

                        <div className="absolute left-3 top-3">

                          {available ? (
                            <span
                              className="
                                inline-flex
                                items-center
                                rounded-lg
                                border
                                border-emerald-500/30
                                bg-emerald-500/10
                                px-2.5
                                py-1
                                font-mono
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-emerald-400
                                backdrop-blur-md
                              "
                            >
                              Disponible
                            </span>
                          ) : (
                            <span
                              className="
                                inline-flex
                                items-center
                                rounded-lg
                                border
                                border-rose-500/30
                                bg-rose-500/10
                                px-2.5
                                py-1
                                font-mono
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-rose-400
                                backdrop-blur-md
                              "
                            >
                              Agotado
                            </span>
                          )}

                        </div>
                      </div>
                    </Link>

                    {/* =========================================
                        INFORMACIÓN
                    ========================================= */}

                    <div className="flex flex-1 flex-col justify-between">

                      <Link
                        href={`/productos/${product.slug}`}
                        className="block"
                      >
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
                      </Link>

                      {/* =========================================
                          PRECIO
                      ========================================= */}

                      <div className="mt-4 border-t border-slate-800/80 pt-4">

                        <div className="flex items-center justify-between gap-3">

                          <p className="font-mono text-lg font-extrabold text-cyan-400">
                            $
                            {Number(product.price).toFixed(2)}
                          </p>

                          {available && (
                            <span className="font-mono text-[10px] text-slate-500">
                              {stock}{" "}
                              {stock === 1
                                ? "unidad"
                                : "unidades"}
                            </span>
                          )}

                        </div>

                        {/* =====================================
                            BOTÓN DE CARRITO / AGOTADO
                        ===================================== */}

                        <div className="mt-4">

                          {available ? (
                            <AddToCartButton
                              product={product}
                            />
                          ) : (
                            <div
                              className="
                                flex
                                w-full
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-rose-500/20
                                bg-rose-500/5
                                px-4
                                py-3
                                font-mono
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-rose-400
                              "
                            >
                              Agotado
                            </div>
                          )}

                        </div>

                        {/* =====================================
                            VER DETALLE
                        ===================================== */}

                        <Link
                          href={`/productos/${product.slug}`}
                          className="
                            mt-3
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-800
                            bg-slate-950
                            px-4
                            py-2.5
                            font-mono
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-400
                            transition-all
                            hover:border-cyan-500/40
                            hover:text-cyan-400
                          "
                        >
                          Ver detalle
                          <span className="transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </Link>

                      </div>
                    </div>
                  </article>
                );
              })}

            </div>
          </>
        )}
      </div>
    </main>
  );
}