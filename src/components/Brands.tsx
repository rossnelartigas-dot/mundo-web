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
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Marcas Destacadas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {brands.map((brand) => (
            <div
              key={brand}
              className="bg-slate-100 rounded-xl p-6 text-center font-bold text-slate-700 hover:bg-cyan-500 hover:text-white transition cursor-pointer"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}