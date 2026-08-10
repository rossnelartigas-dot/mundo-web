"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function Navbar() {
  const router = useRouter();

  const { cart } = useCart();
  const { settings } = useStoreSettings();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const query = search.trim();

    if (query) {
      router.push(`/productos?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/productos");
    }

    setSearchOpen(false);
    setSearch("");
    closeMenu();
  }

  return (
    <header>
      <div className="h-20 flex items-center justify-between">

        {/* LOGO */}

        <Link
          href="/"
          className="flex items-center gap-3"
          style={{ color: settings.primaryColor }}
        >
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.storeName || "Logo de la tienda"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current text-sm font-bold">
              {(settings.storeName || "Mundo Web")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}

          <span className="text-2xl sm:text-3xl font-bold">
            {settings.storeName || "Mundo Web"}
          </span>
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

          {searchOpen ? (
            <form
              onSubmit={handleSearch}
              className="flex items-center"
            >
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                autoFocus
                className="
                  w-32
                  sm:w-48
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2
                  text-sm
                  text-slate-800
                  outline-none
                  focus:border-cyan-400
                  focus:ring-2
                  focus:ring-cyan-100
                "
              />

              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearch("");
                }}
                aria-label="Cerrar búsqueda"
                className="
                  ml-2
                  hover:text-cyan-400
                  transition
                "
              >
                <FaTimes />
              </button>
            </form>
          ) : (
            <button
              type="button"
              aria-label="Buscar"
              onClick={() => setSearchOpen(true)}
              className="hover:text-cyan-400 transition"
            >
              <FaSearch />
            </button>
          )}

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

      {/* BÚSQUEDA MÓVIL */}

      {searchOpen && (
        <div className="md:hidden pb-4">
          <form
            onSubmit={handleSearch}
            className="flex gap-2"
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              autoFocus
              className="
                flex-1
                rounded-lg
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-sm
                text-slate-800
                outline-none
                focus:border-cyan-400
                focus:ring-2
                focus:ring-cyan-100
              "
            />

            <button
              type="submit"
              aria-label="Buscar"
              className="
                rounded-lg
                bg-cyan-500
                px-4
                text-white
                hover:bg-cyan-600
                transition
              "
            >
              <FaSearch />
            </button>
          </form>
        </div>
      )}

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

    </header>
  );
}