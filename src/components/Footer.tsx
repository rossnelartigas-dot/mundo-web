"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function Footer() {
  const { settings } = useStoreSettings();

  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`
    : "#";

  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO E INFORMACIÓN */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <Image
                src={settings.logoUrl}
                alt={settings.storeName}
                width={48}
                height={48}
                className="h-12 w-12 rounded-xl border border-slate-800 object-cover shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                unoptimized
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500 font-mono text-lg font-bold text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                {settings.storeName ? settings.storeName.slice(0, 2).toUpperCase() : "MW"}
              </div>
            )}
            <h3 className="text-2xl font-extrabold tracking-tight text-cyan-400">
              {settings.storeName || "Mundo Web"}
            </h3>
          </div>

          <p className="text-xs font-mono leading-relaxed text-slate-400">
            {settings.description || "Tu tienda de confianza en tecnología, hardware y componentes de alto rendimiento."}
          </p>
        </div>

        {/* NAVEGACIÓN - EMPRESA */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-4">
            Empresa
          </h4>

          <ul className="space-y-2 text-xs font-mono text-slate-400">
            <li>
              <Link href="/nosotros" className="hover:text-cyan-400 transition-colors">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-cyan-400 transition-colors">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/garantias" className="hover:text-cyan-400 transition-colors">
                Garantías
              </Link>
            </li>
          </ul>
        </div>

        {/* CATEGORÍAS */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-4">
            Categorías
          </h4>

          <ul className="space-y-2 text-xs font-mono text-slate-400">
            <li>
              <Link href="/productos?categoria=Laptops" className="hover:text-cyan-400 transition-colors">
                Laptops
              </Link>
            </li>
            <li>
              <Link href="/productos?categoria=Monitores" className="hover:text-cyan-400 transition-colors">
                Monitores
              </Link>
            </li>
            <li>
              <Link href="/productos?categoria=Gaming" className="hover:text-cyan-400 transition-colors">
                Gaming
              </Link>
            </li>
            <li>
              <Link href="/productos?categoria=Accesorios" className="hover:text-cyan-400 transition-colors">
                Accesorios
              </Link>
            </li>
          </ul>
        </div>

        {/* REDES SOCIALES */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-4">
            Síguenos
          </h4>

          <div className="flex gap-4 text-xl">
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              >
                <FaFacebook />
              </a>
            )}

            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-rose-500/50 hover:text-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.25)]"
              >
                <FaInstagram />
              </a>
            )}

            {settings.whatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-emerald-500/50 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              >
                <FaWhatsapp />
              </a>
            )}
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-slate-900 py-6 text-center text-xs font-mono text-slate-500">
        © 2026 {settings.storeName || "Mundo Web"}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
