import { getProduct } from "@/services/productService";
import ProductEditForm from "@/components/admin/ProductEditForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  const product = await getProduct(Number(id));

  if (!product) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center backdrop-blur-md">
        <p className="font-mono text-sm font-semibold text-rose-400">
          [!] Producto no encontrado
        </p>

        <p className="mt-1 text-xs text-slate-400">
          El ID de producto especificado no existe o fue removido del catálogo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 text-slate-100">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-white">
          Editar Producto{" "}
          <span className="font-mono text-xl text-cyan-400">
            #{product.id}
          </span>
        </h1>

        <p className="mt-1 text-xs text-slate-400 font-mono">
          Modifica las especificaciones, precio e inventario del artículo.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        <ProductEditForm product={product} />
      </div>
    </div>
  );
}