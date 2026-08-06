import { getProducts } from "@/services/productService";

export default async function ProductsPage() {

  const products = await getProducts();

  return (

    <div>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">

          Productos

        </h1>

        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-lg">

          Nuevo Producto

        </button>

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

            </tr>

          </thead>

          <tbody>

            {products.map((product) => (

              <tr
                key={product.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-4">

                  {product.name}

                </td>

                <td>

                  {product.brand}

                </td>

                <td>

                  {product.category}

                </td>

                <td>

                  ${product.price}

                </td>

                <td>

                  {product.stock}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}