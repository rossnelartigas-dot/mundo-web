import Link from "next/link";
import { notFound } from "next/navigation";

import { getOrder } from "@/services/orderService";

import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import OrderProductsTable from "@/components/admin/OrderProductsTable";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const order = await getOrder(Number(id));

  if (!order) {
    notFound();
  }

  // ============================================================
  // DATOS NUMÉRICOS
  // ============================================================

  const bcvRate = Number(order.bcv_rate) || 0;
  const totalBs = Number(order.total_bs) || 0;
  const totalUsd = Number(order.total) || 0;
  const paymentAmount = Number(order.payment_amount) || 0;

  // ============================================================
  // FORMATO DE FECHA
  // ============================================================

  const createdAt = order.created_at
    ? new Date(order.created_at).toLocaleString("es-VE")
    : "Sin registro";

  // ============================================================
  // MÉTODO DE PAGO
  // ============================================================

  const paymentMethodLabels: Record<string, string> = {
    pago_movil: "Pago Móvil",
    transferencia: "Transferencia",
    binance: "Binance Pay",
  };

  const paymentMethod =
    paymentMethodLabels[order.payment_method] ||
    order.payment_method ||
    "No especificado";

  return (
    <div className="mx-auto max-w-7xl space-y-8 text-slate-100">

      {/* ========================================================= */}
      {/* ENCABEZADO */}
      {/* ========================================================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-white">
            Pedido{" "}
            <span className="font-mono text-cyan-400">
              #{order.id}
            </span>
          </h1>

          <p className="mt-1 font-mono text-xs text-slate-400">
            Creado: {createdAt}
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-mono text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
        >
          ← Volver a Pedidos
        </Link>

      </div>

      {/* ========================================================= */}
      {/* DATOS DEL CLIENTE + ESTADO */}
      {/* ========================================================= */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* =======================================================
            DATOS DEL CLIENTE
        ======================================================= */}

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">

          <h2 className="border-b border-slate-800/80 pb-3 text-lg font-bold tracking-wide text-white">
            Datos del cliente
          </h2>

          <div className="space-y-3 text-sm">

            {/* NOMBRE */}

            <div className="flex flex-col justify-between gap-1 border-b border-slate-800/40 pb-3 sm:flex-row sm:items-center">

              <span className="font-mono text-xs uppercase text-slate-400">
                Nombre
              </span>

              <span className="font-semibold text-slate-100">
                {order.customer_name || "Sin registro"}
              </span>

            </div>

            {/* TELÉFONO */}

            <div className="flex flex-col justify-between gap-1 border-b border-slate-800/40 pb-3 sm:flex-row sm:items-center">

              <span className="font-mono text-xs uppercase text-slate-400">
                Teléfono
              </span>

              <span className="font-mono text-cyan-400">
                {order.customer_phone || "Sin registro"}
              </span>

            </div>

            {/* CORREO */}

            <div className="flex flex-col justify-between gap-1 border-b border-slate-800/40 pb-3 sm:flex-row sm:items-center">

              <span className="font-mono text-xs uppercase text-slate-400">
                Correo
              </span>

              <span className="break-all font-mono text-slate-200">
                {order.customer_email || "Sin registro"}
              </span>

            </div>

            {/* DIRECCIÓN */}

            <div className="flex flex-col justify-between gap-1 pt-1 sm:flex-row sm:items-start">

              <span className="font-mono text-xs uppercase text-slate-400">
                Dirección
              </span>

              <span className="max-w-md text-slate-200 sm:text-right">
                {order.customer_address || "Sin registro"}
              </span>

            </div>

          </div>

        </div>

        {/* =======================================================
            ESTADO DEL PEDIDO
        ======================================================= */}

        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">

          <div>

            <h2 className="mb-4 border-b border-slate-800/80 pb-3 text-lg font-bold tracking-wide text-white">
              Estado del pedido
            </h2>

            <OrderStatusSelect
              id={order.id}
              status={order.status}
            />

          </div>

          <div className="mt-6 border-t border-slate-800/80 pt-6">

            <DeleteOrderButton
              id={order.id}
            />

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* INFORMACIÓN DEL PAGO */}
      {/* ========================================================= */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">

        <div className="mb-5 border-b border-slate-800/80 pb-3">

          <h2 className="text-lg font-bold tracking-wide text-white">
            Información del pago
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Datos registrados durante la confirmación del pedido.
          </p>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* =====================================================
              MÉTODO DE PAGO
          ===================================================== */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Método de pago
            </p>

            <p className="mt-2 text-sm font-bold text-cyan-400">
              {paymentMethod}
            </p>

          </div>

          {/* =====================================================
              REFERENCIA
          ===================================================== */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Referencia de pago
            </p>

            <p className="mt-2 break-all font-mono text-sm font-bold text-slate-200">
              {order.payment_reference || "No registrada"}
            </p>

          </div>

          {/* =====================================================
              BANCO
          ===================================================== */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Banco
            </p>

            <p className="mt-2 text-sm font-bold text-slate-200">
              {order.payment_bank || "No registrado"}
            </p>

          </div>

          {/* =====================================================
              TELÉFONO DEL PAGO
          ===================================================== */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Teléfono utilizado
            </p>

            <p className="mt-2 font-mono text-sm font-bold text-slate-200">
              {order.payment_phone || "No registrado"}
            </p>

          </div>

          {/* =====================================================
              CÉDULA / ID
          ===================================================== */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Cédula / ID
            </p>

            <p className="mt-2 font-mono text-sm font-bold text-slate-200">
              {order.payment_id_number || "No registrado"}
            </p>

          </div>

          {/* =====================================================
              MONTO REPORTADO
          ===================================================== */}

          <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4">

            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Monto reportado
            </p>

            <p className="mt-2 text-lg font-extrabold text-amber-400">

              {paymentAmount > 0
                ? `Bs. ${paymentAmount.toLocaleString(
                    "es-VE",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}`
                : "No registrado"}

            </p>

          </div>

          {/* =====================================================
              FECHA DEL PAGO
          ===================================================== */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Fecha del pago
            </p>

            <p className="mt-2 font-mono text-sm font-bold text-slate-200">
              {order.payment_date || "No registrada"}
            </p>

          </div>

          {/* =====================================================
              HORA DEL PAGO
          ===================================================== */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Hora del pago
            </p>

            <p className="mt-2 font-mono text-sm font-bold text-slate-200">
              {order.payment_time || "No registrada"}
            </p>

          </div>

          {/* =====================================================
              TASA BCV
          ===================================================== */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">

            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Tasa BCV utilizada
            </p>

            <p className="mt-2 font-mono text-sm font-bold text-cyan-400">

              {bcvRate > 0
                ? `Bs. ${bcvRate.toLocaleString(
                    "es-VE",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )} / USD`
                : "No registrada"}

            </p>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* PRODUCTOS */}
      {/* ========================================================= */}

      <div className="space-y-4">

        <h2 className="text-xl font-bold tracking-wide text-white">
          Productos del pedido
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-1 shadow-2xl backdrop-blur-md">

          <OrderProductsTable
            products={order.products || []}
          />

        </div>

      </div>

      {/* ========================================================= */}
      {/* RESUMEN FINANCIERO */}
      {/* ========================================================= */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md">

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          {/* =====================================================
              INFORMACIÓN DE CONVERSIÓN
          ===================================================== */}

          <div className="space-y-3">

            <div>

              <p className="font-mono text-xs text-slate-500">
                Conversión registrada
              </p>

              {bcvRate > 0 ? (
                <p className="mt-1 font-mono text-sm text-cyan-400">
                  Bs.{" "}
                  {bcvRate.toLocaleString("es-VE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  × ${totalUsd.toFixed(2)}
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">
                  No se registró una tasa BCV.
                </p>
              )}

            </div>

            {totalBs > 0 && (
              <div>

                <p className="font-mono text-xs text-slate-500">
                  Equivalente en bolívares
                </p>

                <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
                  Bs.{" "}
                  {totalBs.toLocaleString("es-VE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

              </div>
            )}

          </div>

          {/* =====================================================
              TOTALES
          ===================================================== */}

          <div className="text-left sm:text-right">

            <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
              Total del pedido
            </p>

            <h2 className="mt-1 font-mono text-4xl font-extrabold text-cyan-400">
              ${totalUsd.toFixed(2)}
            </h2>

            {totalBs > 0 && (
              <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
                Bs.{" "}
                {totalBs.toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}