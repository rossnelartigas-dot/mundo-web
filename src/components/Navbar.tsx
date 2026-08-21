"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaHeart,
  FaChevronDown,
  FaShoppingBag,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();

  const { cart } = useCart();
  const { favorites } = useFavorites();
  const { settings } = useStoreSettings();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  // ============================================================
  // USUARIO AUTENTICADO
  // ============================================================

  const [userProfile, setUserProfile] =
    useState<UserProfile | null>(null);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const userMenuRef =
    useRef<HTMLDivElement>(null);

  // ============================================================
  // CONTADORES
  // ============================================================

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const favoritesCount = favorites.length;

  // ============================================================
  // ESCUCHAR SESIÓN ACTIVA
  // ============================================================

  useEffect(() => {
    async function loadUserSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          setUserProfile(
            data || {
              id: session.user.id,
              email: session.user.email || "",
              full_name:
                session.user.user_metadata?.full_name || "",
              role: "customer",
            }
          );
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error(
          "Error al cargar sesión de usuario:",
          error
        );
      } finally {
        setLoadingUser(false);
      }
    }

    loadUserSession();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadUserSession();
        } else {
          setUserProfile(null);
          setLoadingUser(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ============================================================
  // CERRAR DESPLEGABLE AL HACER CLICK AFUERA
  // ============================================================

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target as Node
        )
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // FUNCIONES
  // ============================================================

  function closeMenu() {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUserProfile(null);

    closeMenu();

    router.push("/");
    router.refresh();
  };

  function handleSearch(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const query = search.trim();

    if (query) {
      router.push(
        `/productos?q=${encodeURIComponent(query)}`
      );
    } else {
      router.push("/productos");
    }

    setSearchOpen(false);
    setSearch("");

    closeMenu();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/90 text-slate-100 shadow-2xl backdrop-blur-md">

      {/* ======================================================
          LÍNEA NEÓN SUPERIOR
      ====================================================== */}

      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${settings.primaryColor || "#06b6d4"},
            #22d3ee,
            ${settings.primaryColor || "#06b6d4"},
            transparent
          )`,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ====================================================
            NAVBAR PRINCIPAL
        ==================================================== */}

        <div className="flex h-[76px] items-center justify-between gap-4">

          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            href="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-3"
          >
            <div
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                bg-slate-900
                shadow-lg
                transition-all
                duration-300
                group-hover:scale-105
              "
              style={{
                borderColor:
                  settings.primaryColor || "#0891b2",

                boxShadow: `0 0 15px ${
                  settings.primaryColor || "#06b6d4"
                }25`,
              }}
            >
              {settings.logoUrl ? (
                <Image
                  src={settings.logoUrl}
                  alt={
                    settings.storeName ||
                    "Logo de la tienda"
                  }
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <span
                  className="font-mono text-sm font-black tracking-tight"
                  style={{
                    color:
                      settings.primaryColor ||
                      "#22d3ee",
                  }}
                >
                  {(settings.storeName || "Mundo Web")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}

              <span className="absolute inset-0 rounded-xl border border-white/5" />
            </div>

            <div className="hidden sm:block">
              <span className="block text-xl font-extrabold tracking-tight text-white">
                {settings.storeName || "Mundo Web"}
              </span>

              <span
                className="block font-mono text-[9px] font-bold uppercase tracking-[0.25em]"
                style={{
                  color:
                    settings.primaryColor ||
                    "#22d3ee",
                }}
              >
                Tecnología & innovación
              </span>
            </div>
          </Link>

          {/* ==================================================
              MENÚ DESKTOP
          ================================================== */}

          <nav className="hidden items-center gap-1 md:flex">

            <Link
              href="/"
              className="
                rounded-xl
                px-4
                py-2
                font-mono
                text-xs
                font-bold
                text-slate-300
                transition-all
                hover:bg-slate-900
                hover:text-cyan-400
              "
            >
              Inicio
            </Link>

            <Link
              href="/productos"
              className="
                rounded-xl
                px-4
                py-2
                font-mono
                text-xs
                font-bold
                text-slate-300
                transition-all
                hover:bg-slate-900
                hover:text-cyan-400
              "
            >
              Productos
            </Link>

            <Link
              href="/categorias"
              className="
                rounded-xl
                px-4
                py-2
                font-mono
                text-xs
                font-bold
                text-slate-300
                transition-all
                hover:bg-slate-900
                hover:text-cyan-400
              "
            >
              Categorías
            </Link>

            <Link
              href="/ofertas"
              className="
                group
                flex
                items-center
                gap-1.5
                rounded-xl
                px-4
                py-2
                font-mono
                text-xs
                font-bold
                text-slate-300
                transition-all
                hover:bg-slate-900
                hover:text-cyan-400
              "
            >
              <span>Ofertas</span>

              <FaChevronDown className="text-[9px] opacity-60 transition group-hover:rotate-180" />
            </Link>

            <Link
              href="/contacto"
              className="
                rounded-xl
                px-4
                py-2
                font-mono
                text-xs
                font-bold
                text-slate-300
                transition-all
                hover:bg-slate-900
                hover:text-cyan-400
              "
            >
              Contacto
            </Link>

          </nav>

          {/* ==================================================
              ACCIONES
          ================================================== */}

          <div className="flex items-center gap-1 sm:gap-2">

            {/* =================================================
                BUSCADOR
            ================================================= */}

            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                className="
                  hidden
                  items-center
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/90
                  px-2
                  shadow-lg
                  backdrop-blur-md
                  sm:flex
                "
              >
                <FaSearch className="ml-2 text-xs text-cyan-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Buscar componentes..."
                  autoFocus
                  className="
                    w-32
                    bg-transparent
                    px-3
                    py-2
                    font-mono
                    text-xs
                    text-white
                    outline-none
                    placeholder:text-slate-500
                    sm:w-40
                    lg:w-52
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
                    rounded-lg
                    p-1.5
                    text-slate-400
                    transition
                    hover:bg-slate-800
                    hover:text-white
                  "
                >
                  <FaTimes className="text-xs" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                aria-label="Buscar"
                onClick={() =>
                  setSearchOpen(true)
                }
                className="
                  hidden
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/60
                  text-slate-300
                  transition-all
                  hover:border-cyan-500/50
                  hover:text-cyan-400
                  hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]
                  sm:flex
                "
              >
                <FaSearch size={14} />
              </button>
            )}

            {/* =================================================
                FAVORITOS
            ================================================= */}

            <Link
              href="/favoritos"
              aria-label="Favoritos"
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-slate-800
                bg-slate-900/60
                text-slate-300
                transition-all
                hover:border-rose-500/50
                hover:text-rose-400
                hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]
              "
            >
              <FaHeart size={14} />

              {favoritesCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1.5
                    -top-1.5
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-rose-500
                    px-1
                    font-mono
                    text-[10px]
                    font-bold
                    text-white
                    shadow-lg
                  "
                >
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* =================================================
                CARRITO
            ================================================= */}

            <Link
              href="/carrito"
              aria-label="Carrito"
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-slate-800
                bg-slate-900/60
                text-slate-300
                transition-all
                hover:border-cyan-500/50
                hover:text-cyan-400
                hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]
              "
            >
              <FaShoppingCart size={14} />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1.5
                    -top-1.5
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-cyan-500
                    px-1
                    font-mono
                    text-[10px]
                    font-bold
                    text-slate-950
                    shadow-[0_0_10px_rgba(6,182,212,0.4)]
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* =================================================
                USUARIO
            ================================================= */}

            {loadingUser ? (
              <div className="hidden h-10 w-10 animate-pulse rounded-xl border border-slate-800 bg-slate-900 sm:block" />
            ) : userProfile ? (
              <div
                className="relative hidden sm:block"
                ref={userMenuRef}
              >
                <button
                  type="button"
                  onClick={() =>
                    setUserMenuOpen(!userMenuOpen)
                  }
                  className="
                    flex
                    h-10
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-900/60
                    px-3
                    text-slate-300
                    transition-all
                    hover:border-cyan-500/50
                    hover:text-cyan-400
                    hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]
                  "
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 font-mono text-xs font-bold text-cyan-400">
                    {userProfile.full_name ? (
                      userProfile.full_name
                        .charAt(0)
                        .toUpperCase()
                    ) : (
                      <FaUser className="text-[10px]" />
                    )}
                  </div>

                  <span className="max-w-[100px] truncate font-mono text-xs font-bold">
                    {userProfile.full_name ||
                      "Mi Cuenta"}
                  </span>

                  <FaChevronDown className="text-[9px] opacity-60" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl">

                    <div className="border-b border-slate-800/80 px-3 py-2.5">
                      <p className="truncate font-mono text-xs font-bold text-white">
                        {userProfile.full_name ||
                          "Usuario"}
                      </p>

                      <p className="truncate font-mono text-[10px] text-slate-400">
                        {userProfile.email}
                      </p>
                    </div>

                    <div className="py-1">

                      <Link
                        href="/pedido"
                        onClick={closeMenu}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-mono text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400"
                      >
                        <FaShoppingBag className="text-cyan-400" />
                        <span>Mis Pedidos</span>
                      </Link>

                      <Link
                        href="/carrito"
                        onClick={closeMenu}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-mono text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400"
                      >
                        <FaShoppingCart className="text-cyan-400" />
                        <span>Mi Carrito</span>
                      </Link>

                      <Link
                        href="/perfil"
                        onClick={closeMenu}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-mono text-xs font-bold text-slate-300 transition hover:bg-slate-800 hover:text-cyan-400"
                      >
                        <FaCog className="text-cyan-400" />
                        <span>Configuración</span>
                      </Link>

                      {userProfile.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={closeMenu}
                          className="flex items-center gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 font-mono text-xs font-bold text-cyan-400 transition hover:bg-cyan-500/20"
                        >
                          <FaUser />
                          <span>Panel Admin</span>
                        </Link>
                      )}

                    </div>

                    <div className="border-t border-slate-800/80 pt-1">

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 font-mono text-xs font-bold text-rose-400 transition hover:bg-rose-500/10"
                      >
                        <FaSignOutAlt />
                        <span>Cerrar Sesión</span>
                      </button>

                    </div>

                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Usuario"
                className="
                  hidden
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/60
                  text-slate-300
                  transition-all
                  hover:border-cyan-500/50
                  hover:text-cyan-400
                  hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]
                  sm:flex
                "
              >
                <FaUser size={14} />
              </Link>
            )}

            {/* =================================================
                MENÚ MÓVIL
            ================================================= */}

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
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-slate-800
                bg-slate-900/60
                text-slate-300
                transition-all
                hover:border-cyan-500/50
                hover:text-cyan-400
                md:hidden
              "
            >
              {menuOpen ? (
                <FaTimes size={16} />
              ) : (
                <FaBars size={16} />
              )}
            </button>

          </div>
        </div>

        {/* ====================================================
            BUSCADOR MÓVIL
        ==================================================== */}

        {searchOpen && (
          <div className="pb-4 sm:hidden">
            <form
              onSubmit={handleSearch}
              className="
                flex
                overflow-hidden
                rounded-xl
                border
                border-slate-800
                bg-slate-900
              "
            >
              <FaSearch className="ml-4 mt-3.5 text-xs text-cyan-400" />

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Buscar productos..."
                autoFocus
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-3
                  py-2.5
                  font-mono
                  text-xs
                  text-white
                  outline-none
                  placeholder:text-slate-500
                "
              />

              <button
                type="submit"
                className="
                  bg-cyan-500
                  px-4
                  font-mono
                  text-xs
                  font-bold
                  text-slate-950
                  transition
                  hover:bg-cyan-400
                "
              >
                Buscar
              </button>
            </form>
          </div>
        )}

        {/* ====================================================
            MENÚ MÓVIL
        ==================================================== */}

        {menuOpen && (
          <nav className="border-t border-slate-900 py-4 md:hidden">

            <div className="space-y-1">

              {/* USUARIO MÓVIL */}

              {userProfile ? (
                <div className="mb-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3">

                  <div className="mb-2 flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 font-mono text-xs font-bold text-cyan-400">
                      {userProfile.full_name ? (
                        userProfile.full_name
                          .charAt(0)
                          .toUpperCase()
                      ) : (
                        <FaUser />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate font-mono text-xs font-bold text-white">
                        {userProfile.full_name ||
                          "Usuario"}
                      </p>

                      <p className="truncate font-mono text-[10px] text-slate-400">
                        {userProfile.email}
                      </p>

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-1.5 border-t border-slate-800/80 pt-2">

                    <Link
                      href="/pedido"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 rounded-lg bg-slate-800/80 py-2 font-mono text-[11px] font-bold text-slate-200"
                    >
                      <FaShoppingBag className="text-cyan-400" />
                      Mis Pedidos
                    </Link>

                    <Link
                      href="/perfil"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 rounded-lg bg-slate-800/80 py-2 font-mono text-[11px] font-bold text-slate-200"
                    >
                      <FaCog className="text-cyan-400" />
                      Configuración
                    </Link>

                  </div>

                  {userProfile.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="mt-1.5 flex items-center justify-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 py-2 font-mono text-[11px] font-bold text-cyan-400"
                    >
                      <FaUser />
                      Panel Admin
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 py-2 font-mono text-[11px] font-bold text-rose-400"
                  >
                    <FaSignOutAlt />
                    Cerrar Sesión
                  </button>

                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-mono text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition hover:bg-cyan-400"
                >
                  <FaUser />
                  Iniciar Sesión
                </Link>
              )}

              {/* NAVEGACIÓN */}

              <Link
                href="/"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  rounded-xl
                  px-4
                  py-3
                  font-mono
                  text-xs
                  font-bold
                  text-slate-300
                  transition
                  hover:bg-slate-900
                  hover:text-cyan-400
                "
              >
                Inicio
              </Link>

              <Link
                href="/productos"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  rounded-xl
                  px-4
                  py-3
                  font-mono
                  text-xs
                  font-bold
                  text-slate-300
                  transition
                  hover:bg-slate-900
                  hover:text-cyan-400
                "
              >
                Productos
              </Link>

              <Link
                href="/categorias"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  rounded-xl
                  px-4
                  py-3
                  font-mono
                  text-xs
                  font-bold
                  text-slate-300
                  transition
                  hover:bg-slate-900
                  hover:text-cyan-400
                "
              >
                Categorías
              </Link>

              <Link
                href="/ofertas"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  font-mono
                  text-xs
                  font-bold
                  text-slate-300
                  transition
                  hover:bg-slate-900
                  hover:text-cyan-400
                "
              >
                <span>Ofertas</span>

                <span className="text-xs text-cyan-400">
                  ⚡
                </span>
              </Link>

              <Link
                href="/favoritos"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  font-mono
                  text-xs
                  font-bold
                  text-slate-300
                  transition
                  hover:bg-rose-500/10
                  hover:text-rose-400
                "
              >
                <span className="flex items-center gap-3">
                  <FaHeart />
                  Favoritos
                </span>

                {favoritesCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 font-mono text-[10px] font-bold text-white">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              <Link
                href="/carrito"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  font-mono
                  text-xs
                  font-bold
                  text-slate-300
                  transition
                  hover:bg-slate-900
                  hover:text-cyan-400
                "
              >
                <span className="flex items-center gap-3">
                  <FaShoppingCart />
                  Carrito
                </span>

                {cartCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1 font-mono text-[10px] font-bold text-slate-950">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/contacto"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  rounded-xl
                  px-4
                  py-3
                  font-mono
                  text-xs
                  font-bold
                  text-slate-300
                  transition
                  hover:bg-slate-900
                  hover:text-cyan-400
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