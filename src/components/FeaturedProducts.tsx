
import Link from "next/link";

import { getProducts } from "@/services/productService";

import { Heart, Star } from "lucide-react";

import AddToCartButton from "./AddToCartButton";

export default async function FeaturedProducts() {
  const products = await getProducts();

  const featuredProducts = products.filter(
    (product) => product.featured
  );

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8">

      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10">
        Productos Destacados
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">

        {featuredProducts.map((product) => (

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

                <img
                  src={product.image}
                  alt={product.name ?? "Producto"}
                  className="
                    w-full
                    h-56
                    sm:h-60
                    lg:h-56
                    object-cover
                  "
                />

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
                  aria-label="Agregar a favoritos"
                  className="
                    hover:text-red-500
                    transition
                  "
                >
                  <Heart size={20} />
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
                      (product.price * product.discount) / 100
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

        ))}

      </div>

    </section>
  );
}