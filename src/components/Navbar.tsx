import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <h1 className="text-3xl font-bold text-cyan-400">
          Mundo Web
        </h1>

        <div className="hidden md:flex gap-8 font-medium">
          <a href="#">Inicio</a>
          <a href="#">Productos</a>
          <a href="#">Categorías</a>
          <a href="#">Ofertas</a>
          <a href="#">Contacto</a>
        </div>

        <div className="flex items-center gap-5 text-xl">
          <FaSearch className="cursor-pointer hover:text-cyan-400" />
          <FaShoppingCart className="cursor-pointer hover:text-cyan-400" />
          <FaUser className="cursor-pointer hover:text-cyan-400" />
        </div>

      </div>
    </header>
  );
}