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

  const {
    toggleFavorite,
    isFavorite,
  } = useFavorites();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(
          "Error cargando productos destacados:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const featuredProducts = products
    .filter(
      (product) =>
        product.featured &&
        product.active !== false
    )
    .slice(0, 8);

  if (loading) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-10 w-72 animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-60 animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-11 w-full animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ENCABEZADO */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">
              <Zap
                size={18}
                className="fill-cyan-500 text-cyan-500"
              />

              <p className="text-sm font-bold uppercase tracking-wider text-cyan-600">
                Selección Mundo Web
              </p>
            </div>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Productos destacados
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500">
              Descubre productos seleccionados especialmente
              para ti, con excelentes precios y disponibilidad.
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
              border-slate-300
              bg-white
              px-5
              py-3
              text-sm
              font-bold
              text-slate-700
              shadow-sm
              transition
              hover:border-cyan-500
              hover:text-cyan-600
              hover:shadow-md
            "
          >
            Ver todos los productos
            <ArrowRight size={17} />
          </Link>

        </div>

        {/* PRODUCTOS */}

        {featuredProducts.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">

            <ShoppingBag
              size={46}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-800">
              Próximamente
            </h3>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Estamos preparando nuestros productos destacados.
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
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-cyan-600
                hover:shadow-md
              "
            >
              Ver productos
              <ArrowRight size={17} />
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {featuredProducts.map((product) => {

              const favorite = isFavorite(product.id);

              const hasDiscount =
                Number(product.discount ?? 0) > 0;

              const discount = Number(
                product.discount ?? 0
              );

              const finalPrice = hasDiscount
                ? product.price -
                  (product.price * discount) / 100
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
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-cyan-200
                    hover:shadow-xl
                  "
                >

                  {/* IMAGEN */}

                  <div className="relative h-64 overflow-hidden bg-slate-100">

                    <Link
                      href={`/productos/${product.slug}`}
                      className="block h-full"
                    >

                      {product.image ? (

                        <Image
                          src={product.image}
                          alt={product.name ?? "Producto"}
                          fill
                          className="
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-slate-300">
                          <ShoppingBag size={52} />
                        </div>

                      )}

                    </Link>

                    {/* DESTACADO */}

                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-lg">

                      <Zap
                        size={12}
                        className="fill-cyan-400 text-cyan-400"
                      />

                      Destacado

                    </div>

                    {/* DESCUENTO */}

                    {hasDiscount && (
                      <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1.5 text-xs font-extrabold text-white shadow-lg">
                        -{discount}%
                      </div>
                    )}

                    {/* FAVORITOS */}

                    <button
                      type="button"
                      aria-label={
                        favorite
                          ? "Quitar de favoritos"
                          : "Agregar a favoritos"
                      }
                      onClick={() =>
                        toggleFavorite(product)
                      }
                      className="
                        absolute
                        bottom-3
                        right-3
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-white/95
                        shadow-lg
                        backdrop-blur
                        transition
                        hover:scale-110
                      "
                    >

                      <Heart
                        size={21}
                        className={
                          favorite
                            ? "text-red-500"
                            : "text-slate-500 hover:text-red-500"
                        }
                        fill={
                          favorite
                            ? "currentColor"
                            : "none"
                        }
                      />

                    </button>

                    {/* VER PRODUCTO */}

                    <Link
                      href={`/productos/${product.slug}`}
                      aria-label={`Ver ${product.name}`}
                      className="
                        absolute
                        bottom-3
                        left-3
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-white/95
                        text-slate-600
                        opacity-0
                        shadow-lg
                        backdrop-blur
                        transition
                        duration-300
                        hover:text-cyan-600
                        group-hover:opacity-100
                      "
                    >
                      <Eye size={20} />
                    </Link>

                  </div>

                  {/* INFORMACIÓN */}

                  <div className="flex flex-1 flex-col p-5">

                    {/* MARCA */}

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {product.brand || "Tecnología"}
                    </p>

                    {/* NOMBRE */}

                    <Link
                      href={`/productos/${product.slug}`}
                    >
                      <h3
                        className="
                          mt-2
                          line-clamp-2
                          min-h-[3.5rem]
                          text-lg
                          font-bold
                          leading-snug
                          text-slate-800
                          transition
                          group-hover:text-cyan-600
                        "
                      >
                        {product.name}
                      </h3>
                    </Link>

                    {/* STOCK */}

                    <div className="mt-3 min-h-[22px]">

                      {outOfStock ? (

                        <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                          Agotado
                        </span>

                      ) : stock <= 5 ? (

                        <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
                          Últimas {stock} unidades
                        </span>

                      ) : (

                        <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">
                          Disponible
                        </span>

                      )}

                    </div>

                    {/* PRECIO */}

                    <div className="mt-4">

                      {hasDiscount && (
                        <p className="text-sm font-medium text-slate-400 line-through">
                          ${Number(product.price).toFixed(2)}
                        </p>
                      )}

                      <div className="flex items-end gap-2">

                        <p className="text-2xl font-extrabold text-cyan-600">
                          ${Number(finalPrice).toFixed(2)}
                        </p>

                        {hasDiscount && (
                          <span className="mb-1 text-xs font-bold text-red-500">
                            Oferta
                          </span>
                        )}

                      </div>

                    </div>

                    {/* CARRITO */}

                    <div className="mt-5">

                      <AddToCartButton
                        product={product}
                      />

                    </div>

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