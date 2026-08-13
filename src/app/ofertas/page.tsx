import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/services/productService";

export default async function OfertasPage() {
  const products = await getProducts();
  const offers = products.filter((product) => product.discount > 0);

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
                Ofertas Especiales
              </h1>
              <p className="mt-1 text-xs font-mono text-slate-400">
                Productos con descuento exclusivo por tiempo limitado.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-rose-950/40 border border-rose-900/50 px-3.5 py-1.5 rounded-full text-xs font-mono text-rose-400 w-fit backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              {offers.length} {offers.length === 1 ? "oferta disponible" : "ofertas disponibles"}
            </div>
          </div>
        </div>

        {/* GRILLA DE OFERTAS */}
        {offers.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center shadow-2xl backdrop-blur-md space-y-3">
            <p className="font-mono text-sm font-semibold text-rose-400">
              [!] No hay ofertas activas en este momento
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Te invitamos a explorar nuestro catálogo completo para descubrir todos los productos disponibles.
            </p>
            <Link
              href="/productos"
              className="mt-4 inline-block rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-mono font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Ver catálogo completo
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((product) => {
              const discountedPrice = (
                product.price -
                (product.price * product.discount) / 100
              ).toFixed(2);

              const imageUrl =
                (product as { image_url?: string; image?: string }).image_url ||
                product.image;

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
                    hover:border-cyan-500/50
                    hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]
                  "
                >
                  {/* BADGE DE DESCUENTO */}
                  <div className="absolute top-8 right-8 z-10 rounded-lg bg-rose-500 px-2.5 py-1 text-[11px] font-mono font-bold text-white shadow-lg animate-pulse">
                    -{product.discount}% OFF
                  </div>

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
                      <h2 className="text-base font-bold text-white transition group-hover:text-cyan-400">
                        {product.name}
                      </h2>

                      <p className="mt-1 text-xs font-mono text-slate-400">
                        {product.brand}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-cyan-400 font-mono">
                          ${discountedPrice}
                        </span>
                        <span className="text-xs font-mono text-slate-500 line-through">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-cyan-500/80 group-hover:translate-x-1 transition-transform">
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
