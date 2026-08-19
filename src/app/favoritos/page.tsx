"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import AddToCartButton from "@/components/AddToCartButton";

export default function FavoritosPage() {
  const {
    favorites,
    removeFromFavorites,
    clearFavorites,
  } = useFavorites();

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

        {/* BREADCRUMB / VOLVER */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono transition-all backdrop-blur-md w-fit"
          >
            ← Volver al inicio
          </Link>
        </div>

        {/* ENCABEZADO */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Mis Favoritos
            </h1>

            <p className="mt-1 text-xs font-mono text-slate-400">
              Lista de productos que has guardado para consultar más tarde.
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-900/50 bg-rose-950/40 px-4 py-2.5 text-xs font-mono text-rose-400 hover:bg-rose-900/40 hover:border-rose-500/50 transition-all backdrop-blur-md"
            >
              <Trash2 size={16} />
              <span>Vaciar favoritos</span>
            </button>
          )}
        </div>

        {/* ESTADO VACÍO */}
        {favorites.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center shadow-2xl backdrop-blur-md space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <Heart size={32} />
            </div>

            <h2 className="text-xl font-bold text-white">
              No tienes favoritos todavía
            </h2>

            <p className="mx-auto max-w-md text-xs font-mono text-slate-400">
              Agrega productos a tus favoritos mientras navegas por la tienda para encontrarlos fácilmente después.
            </p>

            <Link
              href="/productos"
              className="mt-4 inline-block rounded-xl bg-cyan-500 px-6 py-3 text-xs font-mono font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          /* GRILLA DE FAVORITOS */
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((product) => {
              // Product.discount es opcional.
              // Si no existe, el producto simplemente no tiene descuento.
              const discount = product.discount ?? 0;

              const finalPrice =
                discount > 0
                  ? (
                      product.price -
                      (product.price * discount) / 100
                    ).toFixed(2)
                  : product.price.toFixed(2);

              return (
                <div
                  key={product.id}
                  className="
                    group
                    relative
                    flex
                    flex-col
                    justify-between
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
                  <div>
                    {/* IMAGEN DEL PRODUCTO */}
                    <Link
                      href={`/productos/${product.slug}`}
                      className="block relative"
                    >
                      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                            sizes="
                              (min-width:1280px) 18rem,
                              (min-width:1024px) 30vw,
                              (min-width:640px) 45vw,
                              100vw
                            "
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] text-slate-600">
                            [ SIN IMAGEN ]
                          </div>
                        )}
                      </div>

                      {discount > 0 && (
                        <span className="absolute top-3 left-3 z-10 rounded-lg bg-rose-500 px-2 py-0.5 text-[10px] font-mono font-bold text-white shadow-lg">
                          -{discount}%
                        </span>
                      )}
                    </Link>

                    {/* DETALLES */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <Link href={`/productos/${product.slug}`}>
                            <h2 className="line-clamp-2 text-base font-bold text-white transition group-hover:text-cyan-400">
                              {product.name}
                            </h2>
                          </Link>

                          <p className="mt-1 truncate text-xs font-mono text-slate-400">
                            {product.brand}
                          </p>
                        </div>

                        {/* BOTÓN QUITAR DE FAVORITOS */}
                        <button
                          type="button"
                          aria-label="Quitar de favoritos"
                          onClick={() => removeFromFavorites(product.id)}
                          className="shrink-0 rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-950/40 hover:text-rose-400 border border-transparent hover:border-rose-900/50"
                        >
                          <Heart size={20} fill="currentColor" />
                        </button>
                      </div>

                      {product.category && (
                        <span className="inline-block rounded-md bg-slate-950 border border-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                          {product.category}
                        </span>
                      )}

                      {/* PRECIOS */}
                      <div className="pt-2">
                        {discount > 0 && (
                          <p className="text-xs font-mono text-slate-500 line-through">
                            ${product.price.toFixed(2)}
                          </p>
                        )}

                        <p className="text-xl font-extrabold text-cyan-400 font-mono">
                          ${finalPrice}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BOTÓN AGREGAR AL CARRITO */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <AddToCartButton product={product} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}