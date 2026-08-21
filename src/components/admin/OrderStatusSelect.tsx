"use client";

import { useState } from "react";
import {
  Clock3,
  PackageCheck,
  Truck,
  CircleCheck,
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
    icon: CircleCheck,
  },
  {
    value: "cancelado",
    label: "Cancelado",
    icon: CircleX,
  },
];

function normalizeStatus(status: string) {
  const value = status.toLowerCase().trim();

  if (value === "cancelled") return "cancelado";
  if (value === "cancelado") return "cancelado";

  if (value === "pending") return "pending";
  if (value === "pendiente") return "pending";

  if (value === "preparado") return "preparado";

  if (value === "enviado") return "enviado";

  if (value === "entregado") return "entregado";

  return "pending";
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
            className={
              currentStatus === "cancelado"
                ? "text-red-400"
                : currentStatus === "entregado"
                ? "text-emerald-400"
                : currentStatus === "enviado"
                ? "text-blue-400"
                : currentStatus === "preparado"
                ? "text-amber-400"
                : "text-cyan-400"
            }
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
            className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${
              currentStatus === "cancelado"
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : currentStatus === "entregado"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : currentStatus === "enviado"
                ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                : currentStatus === "preparado"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
            }`}
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