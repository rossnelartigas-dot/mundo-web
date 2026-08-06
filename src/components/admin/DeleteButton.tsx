"use client";

import { useRouter } from "next/navigation";
import { deleteProduct } from "@/services/productService";

interface Props {
  id: number;
}

export default function DeleteButton({ id }: Props) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm("¿Eliminar este producto?");

    if (!ok) return;

    try {
      await deleteProduct(id);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error eliminando producto");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-3 py-2 rounded"
    >
      Eliminar
    </button>
  );
}