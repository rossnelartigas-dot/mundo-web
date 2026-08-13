interface Props {
  title: string;
  value: number | string;
}

export default function DashboardCard({ title, value }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-xl hover:border-slate-700/80 transition-all group">
      <p className="text-xs font-mono uppercase tracking-wider text-slate-400 group-hover:text-cyan-400 transition-colors">
        {title}
      </p>

      <h2 className="text-4xl font-extrabold font-mono text-white mt-3 tracking-tight group-hover:text-cyan-300 transition-colors">
        {value}
      </h2>
    </div>
  );
}
