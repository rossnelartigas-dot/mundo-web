"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBcvRate } from "@/services/exchangeRateService";
import {
  Heart,
  ArrowLeft,
  MessageCircle,
  Home,
  ShoppingCart,
  ChevronRight,
  Loader2,
} from "lucide-react";

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

  const [bcvRate, setBcvRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(true);

  const favorite = isFavorite(product.id);

  // Descuento
  const discount = Number(product.discount ?? 0);

  // Precio final en dólares
  const finalPrice =
    discount > 0
      ? product.price - (product.price * discount) / 100
      : product.price;

  /*
   * CONSULTAR TASA BCV
   *
   * La consulta se realiza desde el navegador.
   * Si la API falla, simplemente no mostramos
   * el precio en bolívares.
   */
  useEffect(() => {
  async function loadBcvRate() {
    try {
      setLoadingRate(true);

      const exchangeRate = await getBcvRate();

      if (exchangeRate) {
        setBcvRate(exchangeRate.rate);
      } else {
        setBcvRate(null);
      }
    } catch (error) {
      console.error("Error obteniendo tasa BCV:", error);
      setBcvRate(null);
    } finally {
      setLoadingRate(false);
    }
  }

  loadBcvRate();
}, []);

  // Precio en bolívares
  const priceInBolivares =
    bcvRate !== null ? finalPrice * bcvRate : null;

  const whatsappNumber = settings.whatsapp?.replace(/\D/g, "") || "";

  const whatsappMessage = encodeURIComponent(
    `Hola, estoy interesado en el producto: ${product.name}. SKU: ${product.sku}`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-slate-950 py-8 text-slate-100 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            NAVEGACIÓN SUPERIOR
        ===================================================== */}

        <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider">

          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-slate-800
              bg-slate-900/80
              px-3
              py-2
              text-slate-400
              transition-all
              hover:border-cyan-500/40
              hover:text-cyan-400
            "
          >
            <Home size={14} />
            Inicio
          </Link>

          <ChevronRight
            size={14}
            className="text-slate-700"
          />

          <Link
            href="/productos"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-slate-800
              bg-slate-900/80
              px-3
              py-2
              text-slate-400
              transition-all
              hover:border-cyan-500/40
              hover:text-cyan-400
            "
          >
            <ArrowLeft size={14} />
            Productos
          </Link>

          <ChevronRight
            size={14}
            className="text-slate-700"
          />

          <Link
            href="/carrito"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-cyan-500/30
              bg-cyan-500/5
              px-3
              py-2
              text-cyan-400
              transition-all
              hover:border-cyan-500/60
              hover:bg-cyan-500/10
            "
          >
            <ShoppingCart size={14} />
            Consultar carrito
          </Link>
        </div>

        {/* =====================================================
            PRODUCTO
        ===================================================== */}

        <article
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-800
            bg-slate-900/80
            p-5
            shadow-2xl
            backdrop-blur-md
            sm:p-8
          "
        >
          <div className="grid gap-10 md:grid-cols-2">

            {/* =================================================
                IMAGEN
            ================================================= */}

            <div>
              <div
                className="
                  relative
                  aspect-square
                  w-full
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-950/60
                  p-4
                  shadow-inner
                "
              >
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="
                      object-contain
                      transition-transform
                      duration-500
                      hover:scale-105
                    "
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-mono text-xs text-slate-600">
                    [ SIN IMAGEN ]
                  </div>
                )}

                {discount > 0 && (
                  <span
                    className="
                      absolute
                      left-4
                      top-4
                      rounded-xl
                      border
                      border-emerald-500/30
                      bg-emerald-500/20
                      px-3
                      py-1
                      font-mono
                      text-xs
                      font-bold
                      text-emerald-400
                      shadow-[0_0_12px_rgba(16,185,129,0.2)]
                      backdrop-blur-md
                    "
                  >
                    -{discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* =================================================
                INFORMACIÓN
            ================================================= */}

            <div className="flex flex-col justify-between">

              <div>

                {/* MARCA + FAVORITO */}

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400/80">
                      {product.brand || "TECNOLOGÍA"}
                    </p>

                    <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                      {product.name}
                    </h1>
                  </div>

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
                      fill={
                        favorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                </div>

                {/* CATEGORÍA */}

                <p className="mt-3 font-mono text-xs text-slate-400">
                  Categoría:{" "}
                  <strong className="text-cyan-400">
                    {product.category}
                  </strong>
                </p>

                {/* =================================================
                    PRECIO
                ================================================= */}

                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-950/70
                    p-5
                  "
                >

                  <div className="flex flex-wrap items-baseline gap-3">

                    <p className="font-mono text-3xl font-extrabold text-cyan-400 sm:text-4xl">
                      ${finalPrice.toFixed(2)}
                    </p>

                    {discount > 0 && (
                      <p className="font-mono text-lg text-slate-500 line-through">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    )}

                  </div>

                  {/* PRECIO BCV */}

                  <div className="mt-4 border-t border-slate-800/80 pt-4">

                    {loadingRate ? (
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                        Consultando tasa BCV...
                      </div>
                    ) : bcvRate !== null ? (
                      <>
                        <p className="font-mono text-xs uppercase tracking-wider text-slate-500">
                          Precio en bolívares
                        </p>

                        <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-400">
                          Bs.{" "}
                          {priceInBolivares?.toLocaleString(
                            "es-VE",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>

                        <p className="mt-1 font-mono text-[10px] text-slate-500">
                          Tasa BCV: Bs.{" "}
                          {bcvRate.toLocaleString(
                            "es-VE",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          por USD
                        </p>
                      </>
                    ) : (
                      <p className="font-mono text-xs text-amber-400">
                        Tasa BCV no disponible temporalmente.
                      </p>
                    )}

                  </div>
                </div>

                {/* =================================================
                    DESCRIPCIÓN
                ================================================= */}

                <div className="mt-6 border-t border-slate-800/80 pt-6">

                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                    Descripción del producto
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {product.description}
                  </p>

                </div>

                {/* =================================================
                    ESPECIFICACIONES
                ================================================= */}

                <div
                  className="
                    mt-6
                    space-y-2
                    rounded-xl
                    border
                    border-slate-800/80
                    bg-slate-950/60
                    p-4
                    font-mono
                    text-xs
                  "
                >

                  <div className="flex justify-between border-b border-slate-800/50 pb-2 text-slate-400">
                    <span>Stock disponible:</span>

                    <strong
                      className={
                        product.stock > 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} unidades`
                        : "Agotado"}
                    </strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-800/50 py-2 text-slate-400">
                    <span>SKU:</span>

                    <strong className="text-slate-200">
                      {product.sku}
                    </strong>
                  </div>

                  <div className="flex justify-between pt-2 text-slate-400">
                    <span>Peso:</span>

                    <strong className="text-slate-200">
                      {product.weight} Kg
                    </strong>
                  </div>

                </div>

              </div>

              {/* =================================================
                  BOTONES
              ================================================= */}

              <div className="mt-8 space-y-3">

                {/* CARRITO */}

                <AddToCartButton product={product} />

                {/* WHATSAPP */}

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

                {/* NAVEGACIÓN */}

                <div className="grid grid-cols-2 gap-3">

                  <Link
                    href="/"
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-800
                      bg-slate-950
                      px-4
                      py-3
                      font-mono
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-400
                      transition-all
                      hover:border-cyan-500/40
                      hover:text-cyan-400
                    "
                  >
                    <Home size={16} />
                    Volver al inicio
                  </Link>

                  <Link
                    href="/carrito"
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-cyan-500/30
                      bg-cyan-500/5
                      px-4
                      py-3
                      font-mono
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-cyan-400
                      transition-all
                      hover:border-cyan-500/60
                      hover:bg-cyan-500/10
                    "
                  >
                    <ShoppingCart size={16} />
                    Consultar carrito
                  </Link>

                </div>

              </div>

            </div>
          </div>
        </article>
      </div>
    </main>
  );
}