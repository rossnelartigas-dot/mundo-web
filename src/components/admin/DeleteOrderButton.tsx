"use client";

import { useRouter } from "next/navigation";
import { deleteOrder } from "@/services/orderService";

interface Props {
  id: number;
}

export default function DeleteOrderButton({
  id,
}: Props) {
  const router = useRouter();

  async function handleDelete() {
    const confirmDelete = confirm(
      "¿Eliminar este pedido?"
    );

    if (!confirmDelete) return;

    try {
      await deleteOrder(id);

      router.refresh();
    } catch {
      alert("No se pudo eliminar.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
    >
      Eliminar
    </button>
  );
}