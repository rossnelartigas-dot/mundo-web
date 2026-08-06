import { getProduct } from "@/services/productService";
import ProductEditForm from "@/components/admin/ProductEditForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const product = await getProduct(Number(id));

  if (!product) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">
        Editar Producto
      </h1>

      <div className="bg-white rounded-xl shadow p-8">
        <ProductEditForm product={product} />
      </div>
    </div>
  );
}