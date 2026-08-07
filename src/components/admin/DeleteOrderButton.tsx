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
      "¿Estás seguro de que quieres eliminar este pedido?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteOrder(id);

      alert(
        "Pedido eliminado correctamente"
      );

      router.push(
        "/admin/orders"
      );

      router.refresh();

    } catch (error) {
      console.error(
        "Error eliminando pedido:",
        error
      );

      alert(
        "No se pudo eliminar el pedido"
      );
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
    >
      Eliminar pedido
    </button>
  );
}