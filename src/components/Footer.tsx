"use client";

import Image from "next/image";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export default function Footer() {
  const { settings } = useStoreSettings();

  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

        <div>
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <Image
                src={settings.logoUrl}
                alt={settings.storeName}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-lg font-bold text-white">
                {settings.storeName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <h3 className="text-2xl font-bold text-cyan-400">
              {settings.storeName}
            </h3>
          </div>

          <p className="mt-4 text-slate-300">
            {settings.description}
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Empresa</h4>

          <ul className="space-y-2 text-slate-300">
            <li>Nosotros</li>
            <li>Contacto</li>
            <li>Garantías</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Categorías</h4>

          <ul className="space-y-2 text-slate-300">
            <li>Laptops</li>
            <li>Monitores</li>
            <li>Gaming</li>
            <li>Accesorios</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Síguenos</h4>

          <div className="flex gap-5 text-2xl">
            <FaFacebook className="cursor-pointer hover:text-blue-500 transition" />
            <FaInstagram className="cursor-pointer hover:text-pink-500 transition" />
            <FaWhatsapp className="cursor-pointer hover:text-green-500 transition" />
          </div>
        </div>

      </div>

      <div className="border-t border-slate-700 py-6 text-center text-slate-400">
        © 2026 {settings.storeName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}