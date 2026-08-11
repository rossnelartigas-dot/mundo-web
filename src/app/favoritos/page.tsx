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
    <main className="min-h-screen bg-slate-50 py-10">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Link
          href="/"
          className="text-sm text-cyan-600 hover:text-cyan-700"
        >
          ← Volver al inicio
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Mis Favoritos
            </h1>

            <p className="mt-2 text-slate-600">
              Productos que has guardado como favoritos.
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-red-200
                px-4
                py-2.5
                text-sm
                font-medium
                text-red-500
                transition
                hover:bg-red-50
              "
            >
              <Trash2 size={18} />
              Vaciar favoritos
            </button>
          )}

        </div>

        {favorites.length === 0 ? (
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

            <Heart
              size={48}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-xl font-semibold text-slate-800">
              No tienes favoritos todavía
            </h2>

            <p className="mt-2 text-slate-500">
              Agrega productos a favoritos para
              encontrarlos fácilmente después.
            </p>

            <Link
              href="/productos"
              className="
                mt-6
                inline-flex
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
              Explorar productos
            </Link>

          </div>
        ) : (

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {favorites.map((product) => (

              <div
                key={product.id}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-md
                "
              >

                <Link
                  href={`/productos/${product.slug}`}
                  className="block"
                >

                  {product.image ? (
                    <div className="relative h-56 w-full">

                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="
                          (min-width:1280px) 18rem,
                          (min-width:1024px) 30vw,
                          (min-width:640px) 45vw,
                          100vw
                        "
                      />

                    </div>
                  ) : (
                    <div
                      className="
                        h-56
                        w-full
                        bg-slate-100
                      "
                    />
                  )}

                </Link>

                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <Link
                        href={`/productos/${product.slug}`}
                      >
                        <h2
                          className="
                            line-clamp-2
                            text-lg
                            font-bold
                            text-slate-800
                            transition
                            hover:text-cyan-600
                          "
                        >
                          {product.name}
                        </h2>
                      </Link>

                      <p className="mt-2 truncate text-sm text-slate-500">
                        {product.brand}
                      </p>

                    </div>

                    <button
                      type="button"
                      aria-label="Quitar de favoritos"
                      onClick={() =>
                        removeFromFavorites(product.id)
                      }
                      className="
                        shrink-0
                        text-red-500
                        transition
                        hover:text-red-600
                      "
                    >
                      <Heart
                        size={22}
                        fill="currentColor"
                      />
                    </button>

                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {product.category}
                  </p>

                  {product.discount > 0 && (
                    <p
                      className="
                        mt-3
                        text-sm
                        text-gray-400
                        line-through
                      "
                    >
                      ${product.price.toFixed(2)}
                    </p>
                  )}

                  <p
                    className="
                      mt-2
                      text-2xl
                      font-bold
                      text-cyan-600
                    "
                  >
                    $
                    {product.discount > 0
                      ? (
                          product.price -
                          (product.price *
                            product.discount) /
                            100
                        ).toFixed(2)
                      : product.price.toFixed(2)}
                  </p>

                  <AddToCartButton
                    product={product}
                  />

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}