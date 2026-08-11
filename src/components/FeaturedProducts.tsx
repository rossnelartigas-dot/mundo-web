"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { getProducts } from "@/services/productService";
import { useFavorites } from "@/context/FavoritesContext";

import { Heart, Star } from "lucide-react";

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

  const featuredProducts = products.filter(
    (product) => product.featured
  );

  if (loading) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10">
          Productos Destacados
        </h2>

        <p className="text-slate-500">
          Cargando productos...
        </p>
      </section>
    );
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8">

      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10">
        Productos Destacados
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">

        {featuredProducts.map((product) => {
          const favorite = isFavorite(product.id);

          return (
            <div
              key={product.id}
              className="
                bg-white
                rounded-2xl
                shadow
                hover:shadow-xl
                transition
                overflow-hidden
                w-full
                min-w-0
              "
            >

              <Link
                href={`/productos/${product.slug}`}
                className="block"
              >
                {product.image ? (
                  <div className="w-full h-56 sm:h-60 lg:h-56 relative">

                    <Image
                      src={product.image}
                      alt={product.name ?? "Producto"}
                      fill
                      className="object-cover"
                      sizes="(min-width:1024px) 14rem, (min-width:640px) 15rem, 100vw"
                    />

                  </div>
                ) : (
                  <div
                    className="
                      w-full
                      h-56
                      sm:h-60
                      lg:h-56
                      bg-gray-100
                    "
                  />
                )}
              </Link>

              <div className="p-4 sm:p-5">

                <div className="flex justify-between items-center">

                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className="
                          sm:w-[18px]
                          sm:h-[18px]
                          fill-yellow-400
                          text-yellow-400
                        "
                      />
                    ))}
                  </div>

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
                    className={`
                      transition
                      ${
                        favorite
                          ? "text-red-500"
                          : "text-slate-400 hover:text-red-500"
                      }
                    `}
                  >
                    <Heart
                      size={20}
                      fill={
                        favorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                </div>

                <Link
                  href={`/productos/${product.slug}`}
                >
                  <h3
                    className="
                      font-bold
                      text-base
                      sm:text-lg
                      mt-3
                      hover:text-cyan-600
                      transition
                      line-clamp-2
                      min-h-[3rem]
                    "
                  >
                    {product.name}
                  </h3>
                </Link>

                <p
                  className="
                    text-slate-500
                    text-sm
                    mt-2
                    truncate
                  "
                >
                  {product.brand}
                </p>

                {product.discount > 0 && (
                  <p
                    className="
                      text-gray-400
                      line-through
                      text-sm
                      mt-3
                    "
                  >
                    ${product.price.toFixed(2)}
                  </p>
                )}

                <p
                  className="
                    text-cyan-600
                    font-bold
                    text-xl
                    sm:text-2xl
                    mt-3
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

                <div className="mt-4">

                  <AddToCartButton
                    product={product}
                  />

                </div>

              </div>
            </div>
          );
        })}

      </div>

    </section>
  );
}