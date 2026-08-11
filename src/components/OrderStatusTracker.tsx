"use client";

interface Props {
  status: string;
}

const steps = [
  {
    key: "pending",
    label: "Pedido recibido",
  },
  {
    key: "paid",
    label: "Pagado",
  },
  {
    key: "shipped",
    label: "Enviado",
  },
  {
    key: "delivered",
    label: "Entregado",
  },
];

export default function OrderStatusTracker({
  status,
}: Props) {
  const currentIndex = steps.findIndex(
    (step) => step.key === status
  );

  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            ✕
          </div>

          <div>
            <h3 className="font-bold text-red-700">
              Pedido cancelado
            </h3>

            <p className="mt-1 text-sm text-red-600">
              Este pedido ha sido cancelado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">

      <div className="space-y-6">

        {steps.map((step, index) => {
          const completed =
            currentIndex >= index;

          const active =
            currentIndex === index;

          return (
            <div
              key={step.key}
              className="relative flex items-start gap-4"
            >

              {index < steps.length - 1 && (
                <div
                  className={`
                    absolute
                    left-4
                    top-9
                    h-7
                    w-0.5
                    ${
                      currentIndex > index
                        ? "bg-cyan-500"
                        : "bg-slate-200"
                    }
                  `}
                />
              )}

              <div
                className={`
                  relative
                  z-10
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-sm
                  font-bold
                  ${
                    completed
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }
                  ${
                    active
                      ? "ring-4 ring-cyan-100"
                      : ""
                  }
                `}
              >
                {completed ? "✓" : index + 1}
              </div>

              <div className="pt-1">

                <p
                  className={`
                    font-semibold
                    ${
                      completed
                        ? "text-slate-800"
                        : "text-slate-400"
                    }
                  `}
                >
                  {step.label}
                </p>

                {active && (
                  <p className="mt-1 text-sm text-cyan-600">
                    Estado actual
                  </p>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}