export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-slate-900 text-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-cyan-400">
            Mundo Web
          </h1>

          <nav className="hidden gap-8 md:flex">
            <a href="#" className="hover:text-cyan-400">Inicio</a>
            <a href="#" className="hover:text-cyan-400">Productos</a>
            <a href="#" className="hover:text-cyan-400">Categorías</a>
            <a href="#" className="hover:text-cyan-400">Ofertas</a>
            <a href="#" className="hover:text-cyan-400">Contacto</a>
          </nav>

          <button className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold hover:bg-cyan-600">
            Iniciar sesión
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-700 py-24 text-center text-white">
        <h2 className="mb-4 text-5xl font-bold">
          La tecnología que impulsa tu mundo
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200">
          Encuentra computadoras, laptops, monitores, accesorios,
          componentes y mucho más al mejor precio.
        </p>

        <button className="rounded-xl bg-cyan-400 px-8 py-4 text-lg font-bold text-black hover:bg-cyan-300">
          Comprar ahora
        </button>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h3 className="mb-10 text-center text-3xl font-bold">
          Categorías
        </h3>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            "Computadoras",
            "Laptops",
            "Monitores",
            "Gaming",
            "Accesorios",
            "Redes",
            "Componentes",
            "Almacenamiento",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-white p-8 text-center shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h4 className="font-semibold">{item}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Productos */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="mb-10 text-center text-3xl font-bold">
            Productos destacados
          </h3>

          <div className="grid gap-8 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-xl border bg-gray-50 p-5 shadow-sm"
              >
                <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gray-200">
                  Imagen
                </div>

                <h4 className="font-bold">Producto {item}</h4>

                <p className="mt-2 text-cyan-600 text-xl font-bold">
                  $199
                </p>

                <button className="mt-5 w-full rounded-lg bg-slate-900 py-3 text-white hover:bg-cyan-600">
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10 text-center text-white">
        <h3 className="text-2xl font-bold text-cyan-400">
          Mundo Web
        </h3>

        <p className="mt-3 text-gray-300">
          Todo en tecnología, en un solo lugar.
        </p>

        <p className="mt-6 text-sm text-gray-500">
          © 2026 Mundo Web. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}