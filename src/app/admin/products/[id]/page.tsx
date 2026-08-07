import { getProduct } from "@/services/productService";
import ProductForm from "@/components/admin/ProductForm";


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
        Producto no encontrado
      </div>
    );

  }


  return (

    <div className="max-w-4xl">

      <h1 className="text-3xl font-bold mb-8">
        Editar Producto
      </h1>


      <div className="bg-white rounded-xl shadow p-8">

        <ProductForm product={product} />

      </div>


    </div>

  );

}