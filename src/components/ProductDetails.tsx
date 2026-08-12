"use client";

import Image from "next/image";
import Link from "next/link";

import { Heart } from "lucide-react";

import type { Product } from "@/types/product";

import { useFavorites } from "@/context/FavoritesContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";

import AddToCartButton from "@/components/AddToCartButton";

interface Props {
product: Product;
}

export default function ProductDetails({
product,
}: Props) {
const {
isFavorite,
toggleFavorite,
} = useFavorites();

const { settings } = useStoreSettings();

const favorite = isFavorite(product.id);

const finalPrice =
product.discount > 0
? product.price -
(product.price * product.discount) / 100
: product.price;

const whatsappNumber = settings.whatsapp.replace(
/\D/g,
""
);

const whatsappMessage = encodeURIComponent(
`Hola, estoy interesado en el producto: ${product.name}. SKU: ${product.sku}`
);

const whatsappUrl =
`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

return ( <main className="min-h-screen bg-slate-50 py-10"> <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


    <Link
      href="/productos"
      className="text-sm text-cyan-600 hover:text-cyan-700"
    >
      ← Volver a productos
    </Link>

    <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

      <div className="grid gap-10 md:grid-cols-2">

        {/* IMAGEN */}

        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">

            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(min-width: 768px) 50vw, 100vw"
            />

          </div>
        </div>

        {/* INFORMACIÓN */}

        <div>

          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-sm text-slate-500">
                {product.brand}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                {product.name}
              </h1>
            </div>

            {/* FAVORITO */}

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
                shrink-0
                transition
                ${
                  favorite
                    ? "text-red-500"
                    : "text-slate-400 hover:text-red-500"
                }
              `}
            >
              <Heart
                size={28}
                fill={
                  favorite
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Categoría:{" "}
            <strong className="text-slate-700">
              {product.category}
            </strong>
          </p>

          {/* PRECIO */}

          {product.discount > 0 && (
            <p className="mt-6 text-lg text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </p>
          )}

          <p className="mt-1 text-4xl font-bold text-cyan-600">
            ${finalPrice.toFixed(2)}
          </p>

          {product.discount > 0 && (
            <p className="mt-2 text-sm font-semibold text-green-600">
              {product.discount}% de descuento
            </p>
          )}

          {/* DESCRIPCIÓN */}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Descripción
            </h2>

            <p className="mt-2 leading-7 text-slate-600">
              {product.description}
            </p>
          </div>

          {/* INFORMACIÓN */}

          <div className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4">

            <p className="text-sm text-slate-600">
              Stock disponible:{" "}
              <strong className="text-slate-800">
                {product.stock}
              </strong>
            </p>

            <p className="text-sm text-slate-600">
              SKU:{" "}
              <strong className="text-slate-800">
                {product.sku}
              </strong>
            </p>

            <p className="text-sm text-slate-600">
              Peso:{" "}
              <strong className="text-slate-800">
                {product.weight} Kg
              </strong>
            </p>

          </div>

          {/* CARRITO */}

          <div className="mt-6">

            <AddToCartButton
              product={product}
            />

          </div>

          {/* WHATSAPP */}

          {whatsappNumber && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-4
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-green-600
                px-6
                py-3
                font-medium
                text-white
                transition
                hover:bg-green-700
              "
            >
              Consultar por WhatsApp
            </a>
          )}

        </div>

      </div>

    </article>

  </div>
</main>

);
}
