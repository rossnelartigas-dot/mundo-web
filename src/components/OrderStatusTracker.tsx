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

export default function OrderStatusTracker({ status }: Props) {
  const currentIndex = steps.findIndex((step) => step.key === status);
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.15)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/20 font-mono text-base font-bold text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            ✕
          </div>

          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-rose-400">
              Pedido cancelado
            </h3>

            <p className="mt-0.5 font-mono text-xs text-rose-300/80">
              Este pedido ha sido cancelado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
      <div className="space-y-6">
        {steps.map((step, index) => {
          const completed = currentIndex >= index;
          const active = currentIndex === index;

          return (
            <div key={step.key} className="relative flex items-start gap-4">
              {/* LÍNEA CONECTORA */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    absolute
                    left-4
                    top-9
                    h-7
                    w-0.5
                    transition-colors
                    duration-300
                    ${
                      currentIndex > index
                        ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                        : "bg-slate-800"
                    }
                  `}
                />
              )}

              {/* ÍCONO/NÚMERO DE PASO */}
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
                  rounded-xl
                  border
                  font-mono
                  text-xs
                  font-bold
                  transition-all
                  duration-300
                  ${
                    completed
                      ? "border-cyan-400 bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "border-slate-800 bg-slate-950 text-slate-500"
                  }
                  ${
                    active
                      ? "ring-4 ring-cyan-500/20 border-cyan-400"
                      : ""
                  }
                `}
              >
                {completed ? "✓" : index + 1}
              </div>

              {/* INFORMACIÓN DEL PASO */}
              <div className="pt-0.5">
                <p
                  className={`
                    font-mono
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    transition-colors
                    ${
                      completed
                        ? "text-white"
                        : "text-slate-500"
                    }
                  `}
                >
                  {step.label}
                </p>

                {active && (
                  <p className="mt-1 font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
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
