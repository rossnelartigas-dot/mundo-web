"use client";

import Image from "next/image";
import Link from "next/link";

import { Heart, ArrowLeft, MessageCircle } from "lucide-react";

import type { Product } from "@/types/product";

import { useFavorites } from "@/context/FavoritesContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";

import AddToCartButton from "@/components/AddToCartButton";

interface Props {
  product: Product;
}

export default function ProductDetails({ product }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { settings } = useStoreSettings();

  const favorite = isFavorite(product.id);

  const finalPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  const whatsappNumber = settings.whatsapp?.replace(/\D/g, "") || "";

  const whatsappMessage = encodeURIComponent(
    `Hola, estoy interesado en el producto: ${product.name}. SKU: ${product.sku}`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-slate-950 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* BOTÓN VOLVER */}
        <Link
          href="/productos"
          className="
            inline-flex
            items-center
            gap-2
            font-mono
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-cyan-400
            transition-colors
            hover:text-cyan-300
          "
        >
          <ArrowLeft size={14} />
          Volver a productos
        </Link>

        <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="grid gap-10 md:grid-cols-2">
            {/* IMAGEN */}
            <div>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-inner">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-500 hover:scale-105"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                />

                {product.discount > 0 && (
                  <span className="absolute left-4 top-4 rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-400 backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* INFORMACIÓN */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400/80">
                      {product.brand}
                    </p>

                    <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
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
                    onClick={() => toggleFavorite(product)}
                    className={`
                      shrink-0
                      rounded-xl
                      border
                      p-2.5
                      transition-all
                      duration-300
                      ${
                        favorite
                          ? "border-rose-500/50 bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.25)]"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:border-rose-500/40 hover:text-rose-400"
                      }
                    `}
                  >
                    <Heart
                      size={22}
                      fill={favorite ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <p className="mt-3 font-mono text-xs text-slate-400">
                  Categoría:{" "}
                  <strong className="text-cyan-400">
                    {product.category}
                  </strong>
                </p>

                {/* PRECIO */}
                <div className="mt-6 flex items-baseline gap-3">
                  <p className="font-mono text-3xl font-extrabold text-cyan-400 sm:text-4xl">
                    ${finalPrice.toFixed(2)}
                  </p>

                  {product.discount > 0 && (
                    <p className="font-mono text-lg text-slate-500 line-through">
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* DESCRIPCIÓN */}
                <div className="mt-6 border-t border-slate-800/80 pt-6">
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                    Descripción del producto
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {product.description}
                  </p>
                </div>

                {/* ESPECIFICACIONES / METADATOS */}
                <div className="mt-6 space-y-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-800/50 pb-2 text-slate-400">
                    <span>Stock disponible:</span>
                    <strong className={product.stock > 0 ? "text-emerald-400" : "text-rose-400"}>
                      {product.stock > 0 ? `${product.stock} unidades` : "Agotado"}
                    </strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-800/50 py-2 text-slate-400">
                    <span>SKU:</span>
                    <strong className="text-slate-200">{product.sku}</strong>
                  </div>

                  <div className="flex justify-between pt-2 text-slate-400">
                    <span>Peso:</span>
                    <strong className="text-slate-200">{product.weight} Kg</strong>
                  </div>
                </div>
              </div>

              {/* ACCIONES Y BOTONES */}
              <div className="mt-8 space-y-3">
                <AddToCartButton product={product} />

                {whatsappNumber && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2.5
                      rounded-xl
                      border
                      border-emerald-500/30
                      bg-emerald-500/10
                      px-6
                      py-3.5
                      font-mono
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-emerald-400
                      shadow-lg
                      transition-all
                      duration-300
                      hover:bg-emerald-500/20
                      hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]
                      active:scale-[0.98]
                    "
                  >
                    <MessageCircle size={18} />
                    Consultar por WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
