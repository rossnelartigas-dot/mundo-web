import { Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

        <div>
          <h3 className="text-2xl font-bold text-cyan-400">
            Mundo Web
          </h3>

          <p className="mt-4 text-slate-300">
            Tu tienda de tecnología en Venezuela.
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

          <div className="flex gap-4">
            <Facebook />
            <Instagram />
            <MessageCircle />
          </div>
        </div>

      </div>

      <div className="border-t border-slate-700 py-6 text-center text-slate-400">
        © 2026 Mundo Web. Todos los derechos reservados.
      </div>
    </footer>
  );
}