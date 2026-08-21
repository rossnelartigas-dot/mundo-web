"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateOrderStatus } from "@/services/orderService";
import { Loader2 } from "lucide-react";

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

    if (newStatus === value) {
      return;
    }

    const previousStatus = value;

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

      setValue(previousStatus);

      alert(
        "No se pudo actualizar el estado del pedido."
      );
    } finally {
      setLoading(false);
    }
  }

  const statusStyles: Record<string, string> = {
    pending:
      "border-amber-500/40 bg-amber-500/10 text-amber-400",

    confirmed:
      "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",

    paid:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",

    preparing:
      "border-blue-500/40 bg-blue-500/10 text-blue-400",

    shipped:
      "border-purple-500/40 bg-purple-500/10 text-purple-400",

    delivered:
      "border-green-500/40 bg-green-500/10 text-green-400",

    cancelled:
      "border-red-500/40 bg-red-500/10 text-red-400",
  };

  const currentStyle =
    statusStyles[value] ||
    "border-slate-700 bg-slate-900 text-slate-300";

  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={handleChange}
        disabled={loading}
        className={`
          appearance-none
          min-w-[135px]
          rounded-xl
          border
          ${currentStyle}
          bg-slate-950
          px-3
          py-2
          pr-8
          text-xs
          font-mono
          font-bold
          outline-none
          transition-all
          cursor-pointer
          hover:brightness-110
          focus:ring-2
          focus:ring-cyan-500/20
          disabled:cursor-not-allowed
          disabled:opacity-50
        `}
      >
        <option
          value="pending"
          className="bg-slate-950 text-amber-400"
        >
          Pendiente
        </option>

        <option
          value="confirmed"
          className="bg-slate-950 text-cyan-400"
        >
          Confirmado
        </option>

        <option
          value="paid"
          className="bg-slate-950 text-emerald-400"
        >
          Pagado
        </option>

        <option
          value="preparing"
          className="bg-slate-950 text-blue-400"
        >
          Preparando
        </option>

        <option
          value="shipped"
          className="bg-slate-950 text-purple-400"
        >
          Enviado
        </option>

        <option
          value="delivered"
          className="bg-slate-950 text-green-400"
        >
          Entregado
        </option>

        <option
          value="cancelled"
          className="bg-slate-950 text-red-400"
        >
          Cancelado
        </option>
      </select>

      {loading && (
        <Loader2 className="absolute right-2 h-3.5 w-3.5 animate-spin text-cyan-400 pointer-events-none" />
      )}
    </div>
  );
}