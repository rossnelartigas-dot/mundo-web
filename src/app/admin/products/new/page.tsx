import ProductForm from "@/components/admin/ProductForm";


export default function NewProductPage() {


  return (

    <div className="max-w-4xl">

      <h1 className="text-3xl font-bold mb-8">
        Nuevo Producto
      </h1>


      <div className="bg-white rounded-xl shadow p-8">

        <ProductForm />

      </div>


    </div>

  );

}