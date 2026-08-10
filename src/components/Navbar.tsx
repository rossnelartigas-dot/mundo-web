"use client";

import Link from "next/link";
import { useState } from "react";

import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="w-full bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-20 flex items-center justify-between">

          {/* LOGO */}

          <Link
            href="/"
            className="text-2xl sm:text-3xl font-bold text-cyan-400"
          >
            Mundo Web
          </Link>


          {/* MENÚ DESKTOP */}

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium">

            <Link
              href="/"
              className="hover:text-cyan-400 transition"
            >
              Inicio
            </Link>

            <Link
              href="/productos"
              className="hover:text-cyan-400 transition"
            >
              Productos
            </Link>

            <Link
              href="/categorias"
              className="hover:text-cyan-400 transition"
            >
              Categorías
            </Link>

            <Link
              href="/ofertas"
              className="hover:text-cyan-400 transition"
            >
              Ofertas
            </Link>

            <Link
              href="/contacto"
              className="hover:text-cyan-400 transition"
            >
              Contacto
            </Link>

          </nav>


          {/* ICONOS */}

          <div className="flex items-center gap-4 sm:gap-5 text-xl">

            {/* BUSCAR */}

            <button
              type="button"
              aria-label="Buscar"
              className="hover:text-cyan-400 transition"
            >
              <FaSearch />
            </button>


            {/* CARRITO */}

            <Link
              href="/carrito"
              className="relative hover:text-cyan-400 transition"
              aria-label="Carrito"
            >

              <FaShoppingCart />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -top-3
                    -right-3
                    bg-cyan-500
                    text-white
                    text-xs
                    w-5
                    h-5
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  {cartCount}
                </span>
              )}

            </Link>


            {/* USUARIO */}

            <button
              type="button"
              aria-label="Usuario"
              className="hover:text-cyan-400 transition"
            >
              <FaUser />
            </button>


            {/* BOTÓN MENÚ MÓVIL */}

            <button
              type="button"
              aria-label={
                menuOpen
                  ? "Cerrar menú"
                  : "Abrir menú"
              }
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
              className="
                md:hidden
                text-2xl
                hover:text-cyan-400
                transition
              "
            >
              {menuOpen ? (
                <FaTimes />
              ) : (
                <FaBars />
              )}
            </button>

          </div>

        </div>


        {/* MENÚ MÓVIL */}

        {menuOpen && (
          <nav
            className="
              md:hidden
              border-t
              border-slate-700
              py-4
            "
          >

            <div className="flex flex-col gap-1">

              <Link
                href="/"
                onClick={closeMenu}
                className="
                  py-3
                  px-2
                  rounded-lg
                  hover:bg-slate-800
                  hover:text-cyan-400
                  transition
                "
              >
                Inicio
              </Link>

              <Link
                href="/productos"
                onClick={closeMenu}
                className="
                  py-3
                  px-2
                  rounded-lg
                  hover:bg-slate-800
                  hover:text-cyan-400
                  transition
                "
              >
                Productos
              </Link>

              <Link
                href="/categorias"
                onClick={closeMenu}
                className="
                  py-3
                  px-2
                  rounded-lg
                  hover:bg-slate-800
                  hover:text-cyan-400
                  transition
                "
              >
                Categorías
              </Link>

              <Link
                href="/ofertas"
                onClick={closeMenu}
                className="
                  py-3
                  px-2
                  rounded-lg
                  hover:bg-slate-800
                  hover:text-cyan-400
                  transition
                "
              >
                Ofertas
              </Link>

              <Link
                href="/contacto"
                onClick={closeMenu}
                className="
                  py-3
                  px-2
                  rounded-lg
                  hover:bg-slate-800
                  hover:text-cyan-400
                  transition
                "
              >
                Contacto
              </Link>

            </div>

          </nav>
        )}

      </div>
    </header>
  );
}