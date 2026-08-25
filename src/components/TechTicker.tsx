import { Zap, ShieldCheck, Truck, Cpu, Award, Lock } from "lucide-react";

const items = [
  { icon: Zap, label: "HARDWARE DE ALTO RENDIMIENTO", highlight: "GAMING & PRO" },
  { icon: ShieldCheck, label: "GARANTÍA DIRECTA", highlight: "100% OFICIAL" },
  { icon: Truck, label: "ENVÍOS SEGUROS A TODO EL PAÍS", highlight: "EXPRESS" },
  { icon: Cpu, label: "COMPONENTES DE ÚLTIMA GENERACIÓN", highlight: "RTX & RYZEN" },
  { icon: Award, label: "PRODUCTOS NUEVOS Y SELLADOS", highlight: "ORIGINAL" },
  { icon: Lock, label: "COMPRA PROTEGIDA Y CONFIABLE", highlight: "MUNDO WEB" },
];

export default function TechTicker() {
  return (
    <div className="relative overflow-hidden border-y border-cyan-500/20 bg-slate-950/90 py-3 backdrop-blur-md">
      {/* Sombra / Fade lateral */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-slate-950 to-transparent" />

      <div className="animate-marquee flex items-center gap-8">
        {/* Repetimos 2 veces la lista para efecto infinito continuo */}
        {[...items, ...items].map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 whitespace-nowrap text-xs font-mono text-slate-400 tracking-wider"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Icon size={13} />
              </div>
              <span className="font-bold text-slate-200">{item.label}</span>
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                [{item.highlight}]
              </span>
              <span className="text-slate-700">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
