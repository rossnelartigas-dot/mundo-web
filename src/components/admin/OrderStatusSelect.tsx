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

  async function handleChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newStatus = e.target.value;

    setValue(newStatus);

    try {
      await updateOrderStatus(id, newStatus);
      router.refresh();
    } catch {
      alert("Error actualizando estado");
    }
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className="border rounded-lg px-3 py-2"
    >
      <option value="pending">
        Pendiente
      </option>

      <option value="paid">
        Pagado
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