import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-4xl space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Nuevo Producto
        </h1>
        <p className="mt-1 text-xs text-slate-400 font-mono">
          Registra un nuevo artículo en el inventario global de la tienda.
        </p>
      </div>

      {/* Contenedor con efecto Glassmorphism */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
        <ProductForm />
      </div>
    </div>
  );
}
