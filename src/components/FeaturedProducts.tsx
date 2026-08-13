"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { getProducts } from "@/services/productService";
import { useFavorites } from "@/context/FavoritesContext";

import {
  Heart,
  ArrowRight,
  ShoppingBag,
  Eye,
  Zap,
} from "lucide-react";

import AddToCartButton from "./AddToCartButton";

import type { Product } from "@/types/product";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos destacados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const featuredProducts = products
    .filter((product) => product.featured && product.active !== false)
    .slice(0, 8);

  /* SKELETON LOADER (MODO OSCURO) */
  if (loading) {
    return (
      <section className="bg-slate-950 py-16 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-900" />
            <div className="h-10 w-72 animate-pulse rounded bg-slate-900" />
            <div className="h-5 w-full max-w-xl animate-pulse rounded bg-slate-900" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl"
              >
                <div className="h-60 animate-pulse rounded-xl bg-slate-950" />

                <div className="mt-4 space-y-3">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-950" />
                  <div className="h-5 w-full animate-pulse rounded bg-slate-950" />
                  <div className="h-5 w-24 animate-pulse rounded bg-slate-950" />
                  <div className="h-11 w-full animate-pulse rounded bg-slate-950" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-950 py-16 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ENCABEZADO */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="fill-cyan-400 text-cyan-400" />
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                Selección Mundo Web
              </p>
            </div>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Productos destacados
            </h2>

            <p className="mt-2 text-xs font-mono text-slate-400 max-w-2xl">
              Descubre productos seleccionados especialmente para ti, con excelentes precios y disponibilidad.
            </p>
          </div>

          <Link
            href="/productos"
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-xl
              border
              border-slate-800
              bg-slate-900/80
              px-5
              py-3
              text-xs
              font-mono
              font-bold
              text-slate-300
              shadow-lg
              backdrop-blur-md
              transition-all
              hover:border-cyan-500/50
              hover:text-cyan-400
              hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]
            "
          >
            <span>Ver todos los productos</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* ESTADO VACÍO */}
        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/80 px-6 py-14 text-center shadow-2xl backdrop-blur-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <ShoppingBag size={32} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              Próximamente
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs font-mono text-slate-400">
              Estamos preparando nuestros nuevos componentes e items destacados.
            </p>

            <Link
              href="/productos"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-cyan-500
                px-6
                py-3
                text-xs
                font-mono
                font-bold
                text-slate-950
                shadow-[0_0_15px_rgba(6,182,212,0.3)]
                transition-all
                hover:bg-cyan-400
              "
            >
              <span>Ver productos</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* GRILLA DE PRODUCTOS */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => {
              const favorite = isFavorite(product.id);
              const hasDiscount = Number(product.discount ?? 0) > 0;
              const discount = Number(product.discount ?? 0);
              const finalPrice = hasDiscount
                ? product.price - (product.price * discount) / 100
                : product.price;

              const stock = Number(product.stock ?? 0);
              const outOfStock = stock <= 0;

              return (
                <article
                  key={product.id}
                  className="
                    group
                    relative
                    flex
                    h-full
                    flex-col
                    justify-between
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900/80
                    p-4
                    shadow-xl
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:-translate-y-1.5
                    hover:border-cyan-500/50
                    hover:shadow-[0_0_25px_rgba(6,182,212,0.18)]
                  "
                >
                  <div>
                    {/* IMAGEN DEL PRODUCTO */}
                    <div className="relative h-60 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80">
                      <Link href={`/productos/${product.slug}`} className="block h-full">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name ?? "Producto"}
                            fill
                            className="
                              object-contain
                              p-4
                              transition-transform
                              duration-500
                              group-hover:scale-105
                            "
                            sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-mono text-[10px] text-slate-600">
                            [ SIN IMAGEN ]
                          </div>
                        )}
                      </Link>

                      {/* BADGE DESTACADO */}
                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 text-[10px] font-mono font-bold text-white shadow-lg backdrop-blur-md">
                        <Zap size={10} className="fill-cyan-400 text-cyan-400" />
                        <span>Destacado</span>
                      </div>

                      {/* BADGE DESCUENTO */}
                      {hasDiscount && (
                        <div className="absolute right-3 top-3 rounded-lg bg-rose-500 px-2.5 py-1 text-[10px] font-mono font-bold text-white shadow-lg">
                          -{discount}%
                        </div>
                      )}

                      {/* BOTÓN FAVORITOS */}
                      <button
                        type="button"
                        aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                        onClick={() => toggleFavorite(product)}
                        className="
                          absolute
                          bottom-3
                          right-3
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          bg-slate-900/90
                          border
                          border-slate-800
                          shadow-lg
                          backdrop-blur-md
                          transition-all
                          hover:scale-110
                          hover:border-rose-500/50
                        "
                      >
                        <Heart
                          size={18}
                          className={favorite ? "text-rose-500" : "text-slate-400 hover:text-rose-400"}
                          fill={favorite ? "currentColor" : "none"}
                        />
                      </button>

                      {/* VISTA RÁPIDA */}
                      <Link
                        href={`/productos/${product.slug}`}
                        aria-label={`Ver ${product.name}`}
                        className="
                          absolute
                          bottom-3
                          left-3
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          bg-slate-900/90
                          border
                          border-slate-800
                          text-slate-300
                          opacity-0
                          shadow-lg
                          backdrop-blur-md
                          transition-all
                          duration-300
                          hover:text-cyan-400
                          hover:border-cyan-500/50
                          group-hover:opacity-100
                        "
                      >
                        <Eye size={18} />
                      </Link>
                    </div>

                    {/* DETALLES Y PRECIO */}
                    <div className="mt-4 space-y-2">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {product.brand || "TECNOLOGÍA"}
                      </p>

                      <Link href={`/productos/${product.slug}`}>
                        <h3 className="line-clamp-2 min-h-[3rem] text-sm font-bold text-white transition-colors group-hover:text-cyan-400">
                          {product.name}
                        </h3>
                      </Link>

                      {/* DISPONIBILIDAD / STOCK */}
                      <div>
                        {outOfStock ? (
                          <span className="inline-block rounded-md bg-rose-950/60 border border-rose-900/50 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-400">
                            Agotado
                          </span>
                        ) : stock <= 5 ? (
                          <span className="inline-block rounded-md bg-amber-950/60 border border-amber-900/50 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400">
                            Últimas {stock} unidades
                          </span>
                        ) : (
                          <span className="inline-block rounded-md bg-emerald-950/60 border border-emerald-900/50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                            En stock
                          </span>
                        )}
                      </div>

                      {/* PRECIO */}
                      <div className="pt-2">
                        {hasDiscount && (
                          <p className="text-xs font-mono text-slate-500 line-through">
                            ${Number(product.price).toFixed(2)}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-extrabold font-mono text-cyan-400">
                            ${Number(finalPrice).toFixed(2)}
                          </p>
                          {hasDiscount && (
                            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                              Oferta
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AGREGAR AL CARRITO */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <AddToCartButton product={product} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
