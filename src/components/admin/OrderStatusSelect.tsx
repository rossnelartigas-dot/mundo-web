"use client";

import { useState } from "react";
import {
  Clock3,
  CircleCheck,
  CreditCard,
  PackageCheck,
  Truck,
  CircleCheckBig,
  CircleX,
  Loader2,
} from "lucide-react";

import { updateOrderStatus } from "@/services/orderService";

interface Props {
  id: number;
  status: string;
}

const statuses = [
  {
    value: "pending",
    label: "Pendiente",
    icon: Clock3,
  },
  {
    value: "confirmado",
    label: "Confirmado",
    icon: CircleCheck,
  },
  {
    value: "pagado",
    label: "Pagado",
    icon: CreditCard,
  },
  {
    value: "preparado",
    label: "Preparado",
    icon: PackageCheck,
  },
  {
    value: "enviado",
    label: "Enviado",
    icon: Truck,
  },
  {
    value: "entregado",
    label: "Entregado",
    icon: CircleCheckBig,
  },
  {
    value: "cancelado",
    label: "Cancelado",
    icon: CircleX,
  },
];

function normalizeStatus(status: string) {
  const value = status.toLowerCase().trim();

  // Pendiente
  if (value === "pending" || value === "pendiente") {
    return "pending";
  }

  // Confirmado
  if (value === "confirmed" || value === "confirmado") {
    return "confirmado";
  }

  // Pagado
  if (value === "paid" || value === "pagado") {
    return "pagado";
  }

  // Preparado
  if (value === "prepared" || value === "preparado") {
    return "preparado";
  }

  // Enviado
  if (value === "shipped" || value === "enviado") {
    return "enviado";
  }

  // Entregado
  if (value === "delivered" || value === "entregado") {
    return "entregado";
  }

  // Cancelado
  if (
    value === "cancelled" ||
    value === "canceled" ||
    value === "cancelado"
  ) {
    return "cancelado";
  }

  return "pending";
}

function getStatusColor(status: string) {
  switch (status) {
    case "cancelado":
      return "text-red-400";

    case "entregado":
      return "text-emerald-400";

    case "enviado":
      return "text-blue-400";

    case "preparado":
      return "text-amber-400";

    case "pagado":
      return "text-green-400";

    case "confirmado":
      return "text-violet-400";

    default:
      return "text-cyan-400";
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "cancelado":
      return "border-red-500/30 bg-red-500/10 text-red-400";

    case "entregado":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

    case "enviado":
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";

    case "preparado":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";

    case "pagado":
      return "border-green-500/30 bg-green-500/10 text-green-400";

    case "confirmado":
      return "border-violet-500/30 bg-violet-500/10 text-violet-400";

    default:
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
  }
}

export default function OrderStatusSelect({
  id,
  status,
}: Props) {
  const [currentStatus, setCurrentStatus] = useState(
    normalizeStatus(status)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newStatus = e.target.value;

    if (newStatus === currentStatus) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateOrderStatus(id, newStatus);

      setCurrentStatus(newStatus);
    } catch (err) {
      console.error(
        "Error actualizando estado del pedido:",
        err
      );

      setError(
        "No se pudo actualizar el estado del pedido."
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedStatus =
    statuses.find(
      (item) => item.value === currentStatus
    ) || statuses[0];

  const SelectedIcon = selectedStatus.icon;

  return (
    <div className="space-y-3">

      {/* ======================================================
          SELECTOR
      ====================================================== */}

      <div className="relative">

        <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2">

          <SelectedIcon
            size={18}
            className={getStatusColor(currentStatus)}
          />

        </div>

        <select
          value={currentStatus}
          onChange={handleChange}
          disabled={loading}
          className="w-full cursor-pointer appearance-none rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-11 pr-10 text-sm font-semibold text-white outline-none transition-all hover:border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {statuses.map((item) => (
            <option
              key={item.value}
              value={item.value}
              className="bg-slate-900 text-white"
            >
              {item.label}
            </option>
          ))}

        </select>

        {/* Flecha */}

        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
          ▼
        </div>

      </div>

      {/* ======================================================
          ESTADO ACTUAL
      ====================================================== */}

      <div className="flex items-center justify-between gap-3">

        <div className="flex items-center gap-2">

          <span className="text-xs text-slate-500">
            Estado actual:
          </span>

          <span
            className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${getStatusBadge(
              currentStatus
            )}`}
          >
            {selectedStatus.label}
          </span>

        </div>

        {/* ====================================================
            CARGANDO
        ==================================================== */}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400">

            <Loader2
              size={14}
              className="animate-spin"
            />

            <span>
              Guardando...
            </span>

          </div>
        )}

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-950/20 px-4 py-3 text-xs text-red-400">
          {error}
        </div>
      )}

    </div>
  );
}