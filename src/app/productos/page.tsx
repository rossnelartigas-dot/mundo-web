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

export default async function ProductosPage({
  searchParams,
}: Props) {
  const products = await getProducts();

  const params = await searchParams;

  const query = params.q?.trim().toLowerCase() || "";
  const category = params.categoria?.trim() || "";
  const brand = params.marca?.trim() || "";
  const order = params.orden?.trim() || "recientes";

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
    const name =
      product.name?.toLowerCase() || "";

    const productBrand =
      product.brand?.trim() || "";

    const productCategory =
      product.category?.toLowerCase() || "";

    const sku =
      product.sku?.toLowerCase() || "";

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

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand
    );
  });

  filteredProducts = [...filteredProducts].sort(
    (a, b) => {
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
    }
  );

  const hasFilters =
    query ||
    category ||
    brand ||
    order !== "recientes";

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

        {/* FILTROS */}

        <form
          method="GET"
          className="
            mt-8
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          {query && (
            <input
              type="hidden"
              name="q"
              value={query}
            />
          )}

          <div className="grid gap-4 md:grid-cols-3">

            {/* CATEGORÍA */}

            <div>
              <label
                htmlFor="categoria"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Categoría
              </label>

              <select
                id="categoria"
                name="categoria"
                defaultValue={category}
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-slate-800
                  outline-none
                  focus:border-cyan-400
                  focus:ring-2
                  focus:ring-cyan-100
                "
              >
                <option value="">
                  Todas las categorías
                </option>

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* MARCA */}

            <div>
              <label
                htmlFor="marca"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Marca
              </label>

              <select
                id="marca"
                name="marca"
                defaultValue={brand}
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-slate-800
                  outline-none
                  focus:border-cyan-400
                  focus:ring-2
                  focus:ring-cyan-100
                "
              >
                <option value="">
                  Todas las marcas
                </option>

                {brands.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* ORDENAR */}

            <div>
              <label
                htmlFor="orden"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Ordenar por
              </label>

              <select
                id="orden"
                name="orden"
                defaultValue={order}
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-slate-800
                  outline-none
                  focus:border-cyan-400
                  focus:ring-2
                  focus:ring-cyan-100
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

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              type="submit"
              className="
                rounded-lg
                bg-cyan-500
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-cyan-600
              "
            >
              Aplicar filtros
            </button>

            {hasFilters && (
              <Link
                href="/productos"
                className="
                  rounded-lg
                  border
                  border-slate-300
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-100
                "
              >
                Limpiar filtros
              </Link>
            )}

          </div>

        </form>

        {/* INFORMACIÓN DE FILTROS */}

        {query && (
          <p className="mt-5 text-sm text-slate-500">
            Resultados para:{" "}
            <span className="font-semibold text-slate-700">
              &quot;{query}&quot;
            </span>
          </p>
        )}

        {category && (
          <p className="mt-2 text-sm text-slate-500">
            Categoría:{" "}
            <span className="font-semibold text-slate-700">
              {category}
            </span>
          </p>
        )}

        {brand && (
          <p className="mt-2 text-sm text-slate-500">
            Marca:{" "}
            <span className="font-semibold text-slate-700">
              {brand}
            </span>
          </p>
        )}

        {/* RESULTADOS */}

        {filteredProducts.length === 0 ? (
          <div
            className="
              mt-10
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-10
              text-center
              shadow-sm
            "
          >
            <h2 className="text-xl font-semibold text-slate-800">
              No se encontraron productos
            </h2>

            <p className="mt-2 text-slate-500">
              Intenta cambiar los filtros o realizar otra búsqueda.
            </p>

            <Link
              href="/productos"
              className="
                mt-6
                inline-block
                rounded-lg
                bg-cyan-500
                px-5
                py-2.5
                font-medium
                text-white
                transition
                hover:bg-cyan-600
              "
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <>

            <p className="mt-8 text-sm text-slate-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "producto encontrado"
                : "productos encontrados"}
            </p>

            <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredProducts.map((product) => {
                const imageUrl = product.image || "/placeholder.png";

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
                      border-slate-200
                      bg-white
                      p-5
                      shadow-sm
                      transition
                      hover:-translate-y-1
                      hover:shadow-md
                    "
                  >
                    {/* CONTENEDOR DE IMAGEN */}
                    <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-800 transition group-hover:text-cyan-600">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {product.brand}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {product.category}
                        </p>
                      </div>

                      <p className="mt-4 text-xl font-bold text-cyan-600">
                        ${product.price}
                      </p>
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