"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateOrderStatus } from "@/services/orderService";

interface Props {
  id: number;
  status: string;
}

export default function OrderStatusSelect({
  id,
  status,
}: Props) {
  const router = useRouter();

  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function handleChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newStatus = e.target.value;

    setValue(newStatus);
    setLoading(true);

    try {
      await updateOrderStatus(id, newStatus);

      router.refresh();
    } catch (error) {
      console.error(
        "Error actualizando estado:",
        error
      );

      setValue(status);

      alert(
        "Error actualizando estado"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={loading}
      className="
        rounded-lg
        border
        border-slate-300
        bg-white
        px-3
        py-2
        text-sm
        font-medium
        text-slate-700
        outline-none
        transition
        focus:border-cyan-400
        focus:ring-2
        focus:ring-cyan-100
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <option value="pending">
        Pendiente
      </option>

      <option value="confirmed">
        Confirmado
      </option>

      <option value="paid">
        Pagado
      </option>

      <option value="preparing">
        Preparando
      </option>

      <option value="shipped">
        Enviado
      </option>

      <option value="delivered">
        Entregado
      </option>

      <option value="cancelled">
        Cancelado
      </option>
    </select>
  );
}