"use client";

import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();

  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) {
      return;
    }

    addToCart(product);

    // Puedes sustituir este alert luego por un toast o notificación si lo prefieres
    alert("Producto agregado al carrito");
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={outOfStock}
      className={`
        w-full
        mt-4
        py-2.5
        px-4
        rounded-xl
        flex
        justify-center
        items-center
        gap-2
        text-xs
        font-mono
        font-bold
        transition-all
        duration-300
        ${
          outOfStock
            ? "bg-slate-900 text-slate-600 border border-slate-800/80 cursor-not-allowed opacity-60"
            : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] active:scale-[0.98]"
        }
      `}
    >
      <ShoppingCart size={16} />

      <span>
        {outOfStock ? "AGOTADO" : "AGREGAR AL CARRITO"}
      </span>
    </button>
  );
}
