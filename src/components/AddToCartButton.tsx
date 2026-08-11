"use client";

import { ShoppingCart } from "lucide-react";

import { Product } from "@/types/product";

import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
}

export default function AddToCartButton({
  product,
}: Props) {
  const { addToCart } = useCart();

  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) {
      return;
    }

    addToCart(product);

    alert(
      "Producto agregado al carrito"
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={outOfStock}
      className={`
        w-full
        mt-5
        py-3
        rounded-xl
        flex
        justify-center
        items-center
        gap-2
        text-white
        transition
        ${
          outOfStock
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-cyan-500 hover:bg-cyan-600"
        }
      `}
    >
      <ShoppingCart size={20} />

      {outOfStock
        ? "Producto agotado"
        : "Agregar al carrito"}
    </button>
  );
}