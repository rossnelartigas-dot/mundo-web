import Link from "next/link";
import { getProducts } from "@/services/productService";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Productos</h1>

        <Link
          href="/admin/products/new"
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-lg"
        >
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-4 text-left">Producto</th>
              <th>Marca</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4">{product.name}</td>

                <td>{product.brand}</td>

                <td>{product.category}</td>

                <td>${product.price}</td>

                <td>{product.stock}</td>

                <td>
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                    >
                      Editar
                    </Link>

                    <DeleteButton id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}