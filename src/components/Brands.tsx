const brands = [
  "ASUS",
  "MSI",
  "Dell",
  "HP",
  "Lenovo",
  "Logitech",
  "Samsung",
  "Kingston",
];

export default function Brands() {
  return (
    <section className="bg-slate-950 py-16 text-slate-100 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-2">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            Partners & Hardware
          </p>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Marcas Destacadas
          </h2>
        </div>

        {/* GRILLA DE MARCAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <div
              key={brand}
              className="
                group
                relative
                flex
                items-center
                justify-center
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/80
                p-5
                text-center
                font-mono
                text-sm
                font-bold
                text-slate-300
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-500/50
                hover:bg-slate-900
                hover:text-cyan-400
                hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]
                cursor-pointer
                select-none
              "
            >
              <span className="relative z-10">{brand}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}